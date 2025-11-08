"""
Vanna Service Implementation
Handles Groq LLM integration and SQL generation/execution
"""

import os
from typing import List, Dict, Any
from groq import Groq
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

logger = logging.getLogger(__name__)


class VannaService:
    """Service class for Vanna AI operations with Groq LLM"""
    
    def __init__(self, groq_api_key: str, database_url: str):
        self.groq_api_key = groq_api_key
        self.database_url = database_url
        self.connection = None  # Initialize connection first to avoid AttributeError
        self.groq_client = None  # Initialize later to avoid version conflicts
        
        # Parse database URL
        self._parse_database_url()
    
    def _parse_database_url(self):
        """Parse PostgreSQL connection string"""
        # Format: postgresql://user:password@host:port/database
        if not self.database_url.startswith("postgresql://"):
            raise ValueError("Invalid PostgreSQL URL format")
        
        # Store for later use
        self.db_config = self.database_url
    
    async def initialize(self):
        """Initialize database connection and schema"""
        try:
            # Initialize Groq client
            self.groq_client = Groq(api_key=self.groq_api_key)
            logger.info("✅ Groq client initialized")
            
            # Connect to PostgreSQL
            self.connection = psycopg2.connect(self.database_url)
            logger.info("✅ Connected to PostgreSQL database")
            
            # Load database schema
            await self._load_schema()
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vanna service: {str(e)}")
            raise
    
    async def _load_schema(self):
        """Load database schema for context"""
        try:
            cursor = self.connection.cursor()
            
            # Get table information
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            
            tables = cursor.fetchall()
            logger.info(f"Found {len(tables)} tables in database")
            
            # Store schema context for Groq prompts
            self.schema_context = self._build_schema_context()
            
            cursor.close()
            
        except Exception as e:
            logger.error(f"Error loading schema: {str(e)}")
            raise
    
    def _build_schema_context(self) -> str:
        """Build comprehensive schema description for LLM"""
        schema = """
DATABASE SCHEMA for Flow Analytics (PostgreSQL with Prisma - uses camelCase column names):

1. vendors
   - id: UUID (PK)
   - name: VARCHAR (unique, vendor name)
   - taxId: VARCHAR
   - address: TEXT
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

2. customers  
   - id: UUID (PK)
   - name: VARCHAR (unique, customer name)
   - address: TEXT
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

3. documents
   - id: UUID (PK)
   - externalId: VARCHAR (unique)
   - name: VARCHAR (file name)
   - fileType: VARCHAR
   - filePath: VARCHAR
   - fileSize: BIGINT
   - status: VARCHAR
   - uploadedAt: TIMESTAMP (indexed)
   - processedAt: TIMESTAMP
   - vendorId: UUID (FK -> vendors, indexed)
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

4. invoices
   - id: UUID (PK)
   - invoiceCode: VARCHAR (unique)
   - documentType: VARCHAR
   - currency: VARCHAR
   - invoiceDate: TIMESTAMP (indexed)
   - deliveryDate: TIMESTAMP
   - subTotal: DECIMAL(15,2)
   - totalTax: DECIMAL(15,2)
   - totalAmount: DECIMAL(15,2)
   - vendorId: UUID (FK -> vendors, indexed)
   - customerId: UUID (FK -> customers, indexed)
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

5. invoice_line_items
   - id: UUID (PK)
   - invoiceId: UUID (FK -> invoices)
   - srNo: INTEGER (line number)
   - description: TEXT
   - quantity: FLOAT
   - unitPrice: DECIMAL(15,2)
   - totalPrice: DECIMAL(15,2)
   - vatRate: VARCHAR
   - vatAmount: DECIMAL(15,2)
   - glAccount: VARCHAR (General Ledger account code)
   - buKey: VARCHAR
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

6. payments
   - id: UUID (PK)
   - invoiceId: UUID (FK -> invoices, unique - one payment per invoice)
   - dueDate: TIMESTAMP (indexed)
   - paymentDate: TIMESTAMP
   - amountPaid: DECIMAL(15,2)
   - paymentMethod: VARCHAR
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

7. invoice_documents (junction table)
   - id: UUID (PK)
   - invoiceId: UUID (FK -> invoices)
   - documentId: UUID (FK -> documents)
   - createdAt: TIMESTAMP
   - updatedAt: TIMESTAMP

IMPORTANT: ALL COLUMN NAMES USE camelCase (e.g., vendorId, NOT vendor_id)

COMMON QUERIES EXAMPLES:
- Total spend: SELECT SUM("totalAmount") FROM invoices
- Monthly trends: SELECT DATE_TRUNC('month', "invoiceDate") as month, SUM("totalAmount") FROM invoices GROUP BY month
- Top vendors: SELECT v.name, SUM(i."totalAmount") FROM vendors v JOIN invoices i ON v.id = i."vendorId" GROUP BY v.id, v.name ORDER BY SUM(i."totalAmount") DESC
- GL category spend: SELECT "glAccount", SUM("totalPrice") FROM invoice_line_items GROUP BY "glAccount"
- Payment status: Compare p."paymentDate" with p."dueDate" from payments p
- Overdue invoices: SELECT * FROM invoices i LEFT JOIN payments p ON i.id = p."invoiceId" WHERE p."dueDate" < CURRENT_DATE AND p."paymentDate" IS NULL

CRITICAL RULES:
1. Column names are camelCase - wrap them in double quotes: "vendorId", "totalAmount", "invoiceDate"
2. Table names are lowercase without quotes: invoices, vendors, customers
3. Use table aliases for readability: FROM invoices i JOIN vendors v
4. Always include appropriate JOINs for vendor/customer names
5. Dates are TIMESTAMP type, use DATE_TRUNC for grouping
6. Use CAST or :: for type conversions if needed
"""
        return schema
    
    async def generate_sql(self, question: str) -> str:
        """Generate SQL from natural language using Groq"""
        try:
            # Create prompt for Groq
            prompt = f"""You are a PostgreSQL expert. Convert the following natural language question into a valid PostgreSQL query.

{self.schema_context}

QUESTION: {question}

CRITICAL INSTRUCTIONS:
1. ALL column names MUST use camelCase and be wrapped in double quotes
2. Examples: "vendorId" NOT vendor_id, "totalAmount" NOT total_amount, "invoiceDate" NOT invoice_date
3. Table names are lowercase WITHOUT quotes: invoices, vendors, customers
4. Use table aliases: FROM invoices i JOIN vendors v ON i."vendorId" = v.id

Generate ONLY the SQL query without any explanation or formatting. The query should be executable directly.
Use proper JOINs, WHERE clauses, and GROUP BY as needed.
Return only valid PostgreSQL SQL.

SQL:"""
            
            # Call Groq API
            response = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Groq's latest powerful model
                messages=[
                    {
                        "role": "system",
                        "content": "You are a PostgreSQL expert. Generate only valid SQL queries without explanations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistent SQL
                max_tokens=500
            )
            
            sql = response.choices[0].message.content.strip()
            
            # Clean up the SQL (remove markdown formatting if present)
            sql = sql.replace("```sql", "").replace("```", "").strip()
            
            # Fix common snake_case to camelCase conversions for Prisma
            # Handle both direct column names and table.column references
            replacements = {
                'vendor_id': '"vendorId"',
                '.vendor_id': '."vendorId"',
                'customer_id': '"customerId"',
                '.customer_id': '."customerId"',
                'invoice_id': '"invoiceId"',
                '.invoice_id': '."invoiceId"',
                'document_id': '"documentId"',
                '.document_id': '."documentId"',
                'invoice_code': '"invoiceCode"',
                '.invoice_code': '."invoiceCode"',
                'invoice_date': '"invoiceDate"',
                '.invoice_date': '."invoiceDate"',
                'total_amount': '"totalAmount"',
                '.total_amount': '."totalAmount"',
                'sub_total': '"subTotal"',
                '.sub_total': '."subTotal"',
                'total_tax': '"totalTax"',
                '.total_tax': '."totalTax"',
                'total_price': '"totalPrice"',
                '.total_price': '."totalPrice"',
                'unit_price': '"unitPrice"',
                '.unit_price': '."unitPrice"',
                'gl_account': '"glAccount"',
                '.gl_account': '."glAccount"',
                'due_date': '"dueDate"',
                '.due_date': '."dueDate"',
                'payment_date': '"paymentDate"',
                '.payment_date': '."paymentDate"',
                'amount_paid': '"amountPaid"',
                '.amount_paid': '."amountPaid"',
                'payment_method': '"paymentMethod"',
                '.payment_method': '."paymentMethod"',
                'uploaded_at': '"uploadedAt"',
                '.uploaded_at': '."uploadedAt"',
                'processed_at': '"processedAt"',
                '.processed_at': '."processedAt"',
                'created_at': '"createdAt"',
                '.created_at': '."createdAt"',
                'updated_at': '"updatedAt"',
                '.updated_at': '."updatedAt"',
                'delivery_date': '"deliveryDate"',
                '.delivery_date': '."deliveryDate"',
                'document_type': '"documentType"',
                '.document_type': '."documentType"',
                'file_type': '"fileType"',
                '.file_type': '."fileType"',
                'file_path': '"filePath"',
                '.file_path': '."filePath"',
                'file_size': '"fileSize"',
                '.file_size': '."fileSize"',
                'external_id': '"externalId"',
                '.external_id': '."externalId"',
                'vat_rate': '"vatRate"',
                '.vat_rate': '."vatRate"',
                'vat_amount': '"vatAmount"',
                '.vat_amount': '."vatAmount"',
                'bu_key': '"buKey"',
                '.bu_key': '."buKey"',
                'sr_no': '"srNo"',
                '.sr_no': '."srNo"'
            }
            
            # Apply replacements
            for old, new in replacements.items():
                sql = sql.replace(old, new)
            
            logger.info(f"Generated SQL (after conversion): {sql}")
            return sql
            
        except Exception as e:
            logger.error(f"Error generating SQL: {str(e)}")
            raise
    
    async def execute_sql(self, sql: str) -> List[Dict[str, Any]]:
        """Execute SQL query and return results"""
        try:
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(sql)
            
            # Fetch results
            results = cursor.fetchall()
            
            # Convert to list of dicts
            results_list = [dict(row) for row in results]
            
            cursor.close()
            
            logger.info(f"Query executed. Rows returned: {len(results_list)}")
            return results_list
            
        except Exception as e:
            logger.error(f"Error executing SQL: {str(e)}")
            self.connection.rollback()
            raise
    
    async def ask(self, question: str) -> Dict[str, Any]:
        """Generate SQL from question and execute it"""
        try:
            # Generate SQL
            sql = await self.generate_sql(question)
            
            # Execute SQL
            results = await self.execute_sql(sql)
            
            return {
                "sql": sql,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Error in ask: {str(e)}")
            raise
    
    def train_ddl(self, ddl: str):
        """Train with DDL statements (for future enhancement)"""
        # This can be used to update schema context dynamically
        logger.info("DDL training not yet implemented")
        pass
    
    def train_documentation(self, documentation: str):
        """Train with documentation (for future enhancement)"""
        logger.info("Documentation training not yet implemented")
        pass
    
    def train_sql(self, question: str, sql: str):
        """Train with question-SQL pairs (for future enhancement)"""
        logger.info(f"SQL training not yet implemented: {question}")
        pass
    
    def is_connected(self) -> bool:
        """Check if database connection is active"""
        try:
            if self.connection is None:
                return False
            cursor = self.connection.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            return True
        except:
            return False
    
    def __del__(self):
        """Cleanup database connection"""
        if hasattr(self, 'connection') and self.connection:
            self.connection.close()
            logger.info("Database connection closed")
