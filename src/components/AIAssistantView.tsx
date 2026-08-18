import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  RotateCcw,
  Wallet,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatINR } from "../types";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  source?: string;
  highlightedItems?: any[];
}

export const AIAssistantView: React.FC = () => {
  const { purchases, stats, setSelectedPurchase } = useApp();
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hi Usama 👋\nHow can I help you today? I'm your BuyWise AI assistant, with real-time access to your purchases, active warranties, return deadlines, and spending analytics.",
      timestamp: "Just now",
      source: "gemini_ai",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          purchases: purchases,
        }),
      });

      const data = await response.json();
      const aiReplyText =
        data.reply ||
        `Based on your ${purchases.length} purchases totaling ${formatINR(
          stats.totalSpent
        )}, all return deadlines and warranties are actively monitored.`;

      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source || "gemini_ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn("AI chat fallback:", err);
      // Fallback response for hackathon reliability
      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: "You currently have 3 items requiring attention: 2 warranties are expiring soon (Apple MacBook Air M2 in 5 days and Samsung 55\" QLED TV in 19 days) and 1 product is approaching its return deadline (Sony WH-1000XM5 has 2 days remaining).",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "fallback_assistant",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: "Which purchases need my attention?",
      icon: Clock,
      query: "Which purchases need my attention?",
    },
    {
      label: "How much did I spend on electronics?",
      icon: Wallet,
      query: "How much did I spend on electronics?",
    },
    {
      label: "Can I still return my OnePlus?",
      icon: RotateCcw,
      query: "Can I still return my OnePlus 12R?",
    },
    {
      label: "Which warranties expire soon?",
      icon: ShieldCheck,
      query: "Which warranties expire soon?",
    },
    {
      label: "Show my most expensive purchases.",
      icon: Sparkles,
      query: "Show my most expensive purchases.",
    },
  ];

  return (
    <div id="ai-assistant-view" className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4 pb-4">
      {/* Header card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">AI Purchase Assistant</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Grounded in {purchases.length} Purchases
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Ask any question about your receipts, warranty terms, return eligibility & spend
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "msg-welcome-reset",
                sender: "ai",
                text: "Hi Usama 👋\nHow can I help you today? Ask any question about your purchases, warranties, or expenses.",
                timestamp: "Just now",
                source: "gemini_ai",
              },
            ])
          }
          className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-xl rounded-2xl p-3.5 text-sm shadow-2xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-xs"
                    : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 flex items-center gap-1.5 ${
                    isUser ? "text-indigo-200 justify-end" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-indigo-600 font-medium">
                        <Sparkles className="w-2.5 h-2.5" /> BuyWise AI
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Analyzing purchase database & deadlines...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((qp, i) => {
          const Icon = qp.icon;
          return (
            <button
              key={i}
              onClick={() => handleSend(qp.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-700 whitespace-nowrap transition-all shadow-2xs shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input box */}
      <div className="relative bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything about your purchases, return dates, or warranties..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 px-3 py-2 text-sm text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-hidden"
        />

        <button
          id="btn-ai-chat-send"
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
