"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Database, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { ChatMessage } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI analytics assistant. Ask me anything about your invoices, vendors, or spending patterns. I'll write SQL queries to help you find the answers.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiClient.chatWithData(input);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.success
          ? `I found ${response.results.length} result(s) for your query.`
          : `Sorry, I encountered an error: ${response.error}`,
        sql: response.sql,
        results: response.results,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = (results: any[]) => {
    if (!results || results.length === 0) return null;

    const columns = Object.keys(results[0]);

    return (
      <div className="mt-3 rounded-lg border bg-gray-50 p-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="font-semibold">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {typeof row[col] === 'number' 
                      ? row[col].toLocaleString() 
                      : String(row[col] ?? '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <Card className="h-[calc(100vh-8rem)] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Chat with Your Data
          </CardTitle>
          <p className="text-sm text-gray-500">
            Ask questions about your invoices and spending in natural language
          </p>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 bg-blue-100">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col gap-2 max-w-3xl ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>

                {message.sql && (
                  <div className="w-full rounded-lg border bg-gray-50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600">
                        Generated SQL
                      </span>
                    </div>
                    <pre className="text-xs bg-white rounded p-2 overflow-x-auto border">
                      <code>{message.sql}</code>
                    </pre>
                  </div>
                )}

                {message.results && renderResults(message.results)}

                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-gray-200">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your data..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Example: "Show me top 5 vendors by total spend" or "What's the average invoice amount for last month?"
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
