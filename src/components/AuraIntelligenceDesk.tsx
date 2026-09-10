import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  Scale,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { ProfileState, ChatMessage, ComplianceItem } from '../types';
import { useApp } from '../context/AppContext';

interface AuraIntelligenceDeskProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  profile: ProfileState;
  selectedItemForAI?: ComplianceItem | null;
  onClearSelectedItem?: () => void;
}

const PRESET_QUERIES = [
  'Calculate penalty for 60-day delay in GST filing',
  'Explain ESIC wage threshold limits (₹21,000/mo)',
  'Generate board resolution checklist for Pvt Ltd',
  'Small business exemptions under Udyam MSME',
  'Gram Panchayat business licensing vs Municipal Shop Act',
];

export const AuraIntelligenceDesk: React.FC<AuraIntelligenceDeskProps> = ({
  isOpen,
  onClose,
  onOpen,
  profile,
  selectedItemForAI,
  onClearSelectedItem,
}) => {
  const { isDark } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_welcome',
      sender: 'assistant',
      text: `### **SBCN Compliance AI Assistant**
Calibrated with real-time statutory guidelines for **${profile.businessName || 'your enterprise'}** (${profile.entityType}, ${profile.sector}, ${profile.state}).

Ask me anything about:
- **Small business exemptions** (GSTIN & Udyam criteria)
- **Local body jurisdiction** (Gram Panchayat vs Nagar Palika vs Municipal Corporation)
- **Penalty computations** with interest formulas for delayed returns
- **EPFO / ESIC wage limits & thresholds**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'sbcn-counsel',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If a compliance item was passed to consult AI on
  useEffect(() => {
    if (selectedItemForAI) {
      const query = `Explain the mandatory filing steps, official turnaround time, and specific penalty exposure for "${selectedItemForAI.title}" governed by ${selectedItemForAI.governingAct}. What are the immediate compliance considerations for ${profile.businessName}?`;
      handleSendMessage(query);
      if (onClearSelectedItem) onClearSelectedItem();
    }
  }, [selectedItemForAI]);

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        sender: 'assistant',
        text: `### **History Cleared**
How can I assist **${profile.businessName || 'your enterprise'}** with statutory filings, tax exemptions, or municipal permits today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'sbcn-counsel',
      },
    ]);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          companyContext: {
            businessName: profile.businessName,
            entityType: profile.entityType,
            operationalSector: profile.sector,
            headcount: profile.exactHeadcount,
            headcountTier: profile.headcountTier,
            revenueThreshold: profile.revenueThreshold,
            footprint: profile.footprint,
            crossBorder: profile.crossBorder,
            state: profile.state,
            locationTier: profile.locationTier,
            gramPanchayatName: profile.gramPanchayatName,
            localBodyName: profile.localBodyName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'sbcn-intelligence',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `### **Notice: Statutory Analysis Engine Offline**
We encountered an issue processing the live query. Please verify your connection or retry shortly.

*Error details: ${err?.message || 'Network request failed'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'system-error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger at bottom right */}
      {!isOpen && (
        <button
          id="floating-ai-desk-trigger"
          onClick={onOpen}
          className="fixed right-5 bottom-5 z-40 flex items-center gap-2.5 rounded-full bg-blue-600 dark:bg-blue-600 py-3 pr-4 pl-3.5 text-white shadow-xl hover:bg-blue-700 dark:hover:bg-blue-500 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </div>
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-xs font-bold tracking-wide">
            AI Assistant
          </span>
          <span className="rounded-full bg-blue-500/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
            Online
          </span>
        </button>
      )}

      {/* Slide-over Drawer Interface */}
      {isOpen && (
        <div
          className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col shadow-2xl border-l transition-transform duration-300 ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Drawer Header */}
          <div
            className={`flex items-center justify-between border-b p-4 ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    SBCN Compliance Copilot
                  </h3>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Live Counsel
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Indian Companies Act, GST, MSMED & Panchayati Raj
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear conversation history"
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Current Corporate Profile Badge */}
          <div
            className={`flex items-center justify-between border-b px-4 py-2 text-[11px] font-medium ${
              isDark
                ? 'border-blue-900/50 bg-blue-950/30 text-blue-300'
                : 'border-blue-100 bg-blue-50/70 text-blue-900'
            }`}
          >
            <span>
              Entity: <strong>{profile.businessName}</strong> ({profile.entityType})
            </span>
            <span>
              {profile.locationTier?.includes('Gram Panchayat') ? '🌾 Rural / Panchayat' : profile.state}
            </span>
          </div>

          {/* Chat Messages Area */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDark ? 'bg-slate-950/60' : 'bg-slate-50/50'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : isDark
                      ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="prose prose-xs max-w-none dark:prose-invert">
                    <div
                      className="whitespace-pre-wrap font-sans space-y-1.5"
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdownResponsive(msg.text, isDark),
                      }}
                    />
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user'
                        ? 'text-blue-100'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && <span className="font-mono text-[9px] uppercase">{msg.source}</span>}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-[11px]">
                  Analyzing statutory databases and formulating advisory...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Query Chips */}
          <div
            className={`border-t p-3 ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Common Compliance Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-blue-500 hover:bg-blue-950/40 hover:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 shadow-2xs'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div
            className={`border-t p-3 sm:p-4 ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about GSTIN, Udyam, Gram Panchayat permits, etc..."
                disabled={isLoading}
                className={`flex-1 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Responsive markdown formatter with high contrast for both light and dark mode
function formatMarkdownResponsive(text: string, isDark: boolean): string {
  if (!text) return '';
  const headingClass = isDark ? 'text-white font-bold' : 'text-slate-900 font-bold';
  const subHeadingClass = isDark ? 'text-blue-300 font-bold' : 'text-blue-700 font-bold';
  const strongClass = isDark ? 'text-white font-semibold' : 'text-slate-900 font-semibold';
  const codeClass = isDark ? 'bg-slate-700 text-blue-300' : 'bg-slate-100 text-blue-700';
  const listClass = isDark ? 'text-slate-200' : 'text-slate-700';

  let formatted = text
    // Headings
    .replace(/^### (.*$)/gim, `<h4 class="text-xs ${headingClass} mt-2 mb-1">$1</h4>`)
    .replace(/^## (.*$)/gim, `<h3 class="text-sm ${subHeadingClass} mt-3 mb-1.5">$1</h3>`)
    // Bold
    .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
    // Inline code
    .replace(/`([^`]+)`/g, `<code class="font-mono ${codeClass} px-1 py-0.5 rounded text-[11px]">$1</code>`)
    // Bullet points
    .replace(/^\- (.*$)/gim, `<li class="ml-3 list-disc my-0.5 ${listClass}">$1</li>`);

  return formatted;
}

