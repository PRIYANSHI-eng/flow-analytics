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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // Set default welcome message if loading fails
        setMessages([{
          role: "assistant",
          content: "Hello! I'm your AI analytics assistant. Ask me anything about your invoices, vendors, or spending patterns. I'll write SQL queries to help you find the answers.",
          timestamp: new Date(),
        }]);
      }
    } else {
      // First time - show welcome message
      setMessages([{
        role: "assistant",
        content: "Hello! I'm your AI analytics assistant. Ask me anything about your invoices, vendors, or spending patterns. I'll write SQL queries to help you find the answers.",
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

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
      <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3 overflow-x-auto">
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

  const clearChat = () => {
    const welcomeMessage: ChatMessage = {
      role: "assistant",
      content: "Hello! I'm your AI analytics assistant. Ask me anything about your invoices, vendors, or spending patterns. I'll write SQL queries to help you find the answers.",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    localStorage.setItem('chat-messages', JSON.stringify([welcomeMessage]));
  };

  return (
    <DashboardLayout>
      <Card className="h-[calc(100vh-8rem)] flex flex-col chart-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                💬 Chat with Your Data
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ask questions about your invoices and spending in natural language
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              className="text-xs"
            >
              Clear Chat
            </Button>
          </div>
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
                <Avatar className="h-8 w-8 bg-primary/10 ring-2 ring-primary/20">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col gap-2 max-w-3xl ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-card-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {message.sql && (
                  <div className="w-full rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground">
                        Generated SQL
                      </span>
                    </div>
                    <pre className="text-xs bg-background rounded-lg p-3 overflow-x-auto border border-border">
                      <code className="text-foreground">{message.sql}</code>
                    </pre>
                  </div>
                )}

                {message.results && renderResults(message.results)}

                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-muted ring-2 ring-primary/20">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary/10 ring-2 ring-primary/20">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border text-card-foreground rounded-xl px-4 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4 bg-muted/30">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your data..."
              disabled={loading}
              className="flex-1 bg-background"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Example: "Show me top 5 vendors by total spend" or "What's the average invoice amount for last month?"
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
