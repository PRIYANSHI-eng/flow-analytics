"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [status, setStatus] = useState<string>("Testing...");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        console.log('Testing API at:', apiUrl);
        
        // Test health endpoint
        const healthResponse = await fetch(`${apiUrl}/health`);
        if (!healthResponse.ok) {
          throw new Error(`Health check failed: ${healthResponse.status}`);
        }
        const healthData = await healthResponse.json();
        console.log('Health check:', healthData);
        
        // Test stats endpoint
        const statsResponse = await fetch(`${apiUrl}/api/stats`);
        if (!statsResponse.ok) {
          throw new Error(`Stats failed: ${statsResponse.status}`);
        }
        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);
        
        setData({ health: healthData, stats: statsData });
        setStatus("✅ API is working!");
      } catch (error) {
        console.error('API test failed:', error);
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <p className="text-lg mb-4">{status}</p>
      {data && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
