"""
Vanna AI Service - Natural Language to SQL
FastAPI server for converting natural language queries to SQL using Groq LLM
"""

import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

from vanna_service import VannaService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Vanna AI Service",
    description="Natural Language to SQL conversion using Groq and Vanna AI",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vanna Service
vanna_service: Optional[VannaService] = None


@app.on_event("startup")
async def startup_event():
    """Initialize Vanna service on startup"""
    global vanna_service
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        database_url = os.getenv("DATABASE_URL")
        
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        if not database_url:
            raise ValueError("DATABASE_URL not found in environment variables")
        
        vanna_service = VannaService(groq_api_key, database_url)
        await vanna_service.initialize()
        logger.info("✅ Vanna AI Service initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Vanna service: {str(e)}")
        raise


# Request/Response Models
class AskRequest(BaseModel):
    question: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the total spend for the last 3 months?"
            }
        }


class AskResponse(BaseModel):
    question: str
    sql: str
    results: List[Dict[str, Any]]
    success: bool
    error: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the total spend for the last 3 months?",
                "sql": "SELECT SUM(total_amount) as total_spend FROM invoices WHERE invoice_date >= CURRENT_DATE - INTERVAL '3 months'",
                "results": [{"total_spend": 125000.50}],
                "success": True,
                "error": None
            }
        }


class TrainRequest(BaseModel):
    ddl: Optional[str] = None
    documentation: Optional[str] = None
    sql_examples: Optional[List[Dict[str, str]]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "sql_examples": [
                    {
                        "question": "Show top 5 vendors by spend",
                        "sql": "SELECT v.vendor_name, SUM(i.total_amount) as total FROM vendors v JOIN invoices i ON v.id = i.vendor_id GROUP BY v.id ORDER BY total DESC LIMIT 5"
                    }
                ]
            }
        }


# API Endpoints
@app.get("/")
async def root():
    """Health check and API info"""
    return {
        "service": "Vanna AI Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "/ask": "Convert natural language to SQL and execute",
            "/train": "Train the model with SQL examples",
            "/health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    if vanna_service is None:
        raise HTTPException(status_code=503, detail="Vanna service not initialized")
    
    return {
        "status": "healthy",
        "database_connected": vanna_service.is_connected(),
        "model": "groq-llama3-70b",
        "timestamp": None
    }


@app.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Convert natural language question to SQL and execute it
    
    - **question**: Natural language question about the data
    - Returns SQL query and execution results
    """
    if vanna_service is None:
        raise HTTPException(status_code=503, detail="Vanna service not initialized")
    
    try:
        logger.info(f"Processing question: {request.question}")
        
        # Generate SQL and execute
        result = await vanna_service.ask(request.question)
        
        logger.info(f"Query executed successfully. Rows returned: {len(result.get('results', []))}")
        
        return AskResponse(
            question=request.question,
            sql=result["sql"],
            results=result["results"],
            success=True,
            error=None
        )
    
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        return AskResponse(
            question=request.question,
            sql="",
            results=[],
            success=False,
            error=str(e)
        )


@app.post("/train")
async def train_model(request: TrainRequest):
    """
    Train the Vanna model with additional context
    
    - **ddl**: Database schema DDL statements
    - **documentation**: Documentation about the database
    - **sql_examples**: List of question-SQL pairs for training
    """
    if vanna_service is None:
        raise HTTPException(status_code=503, detail="Vanna service not initialized")
    
    try:
        training_count = 0
        
        if request.ddl:
            vanna_service.train_ddl(request.ddl)
            training_count += 1
        
        if request.documentation:
            vanna_service.train_documentation(request.documentation)
            training_count += 1
        
        if request.sql_examples:
            for example in request.sql_examples:
                vanna_service.train_sql(example["question"], example["sql"])
                training_count += 1
        
        return {
            "success": True,
            "message": f"Model trained with {training_count} new examples",
            "count": training_count
        }
    
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/generate-sql/{question}")
async def generate_sql_only(question: str):
    """
    Generate SQL without executing (for testing)
    
    - **question**: Natural language question
    - Returns only the generated SQL
    """
    if vanna_service is None:
        raise HTTPException(status_code=503, detail="Vanna service not initialized")
    
    try:
        sql = await vanna_service.generate_sql(question)
        return {
            "question": question,
            "sql": sql,
            "note": "SQL not executed. Use /ask to execute."
        }
    except Exception as e:
        logger.error(f"Error generating SQL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
