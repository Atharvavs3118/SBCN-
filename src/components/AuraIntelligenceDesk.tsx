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
} from 'lucide-react';
import { ProfileState, ChatMessage, ComplianceItem } from '../types';

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
  'Cross-border SaaS: GST LUT vs paying IGST with refund',
  'POSH Internal Committee constitution rules for 50+ headcount',
];

export const AuraIntelligenceDesk: React.FC<AuraIntelligenceDeskProps> = ({
  isOpen,
  onClose,
  onOpen,
  profile,
  selectedItemForAI,
  onClearSelectedItem,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_welcome',
      sender: 'assistant',
      text: `### **SBCN AI Assistant Active**
Welcome to your compliance copilot. Calibrated with real-time statutory guidelines for **${profile.businessName || 'your enterprise'}** (${profile.entityType}, ${profile.sector}, ${profile.state}).

You can ask me to:
- **Compute exact penalty exposures** with interest formulas for delayed returns
- **Clarify social security wage brackets** (EPFO/ESIC/Gratuity)
- **Review cross-border transfer pricing & FEMA rules**
- **Draft statutory board resolution covenants**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'aura-counsel',
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
      const query = `Explain the mandatory filing steps, official turnaround time, and specific penalty exposure for "${selectedItemForAI.title}" governed by ${selectedItemForAI.governingAct}. What are the immediate risks for ${profile.businessName}?`;
      handleSendMessage(query);
      if (onClearSelectedItem) onClearSelectedItem();
    }
  }, [selectedItemForAI]);

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
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'aura-intelligence',
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
          className="fixed right-6 bottom-6 z-40 flex items-center gap-2.5 rounded-full bg-[#5B061E] py-3 pr-4 pl-3.5 text-white shadow-2xl transition hover:bg-[#420415] hover:scale-105 active:scale-95 luxury-glow"
        >
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#059669]"></span>
          </div>
          <Sparkles className="h-4 w-4 text-[#D1FAE5]" />
          <span className="text-xs font-semibold tracking-wide">
            SBCN AI Assistant
          </span>
          <span className="rounded-full bg-[#D1FAE5] px-1.5 py-0.5 text-[10px] font-bold text-[#064E3B]">
            AI
          </span>
        </button>
      )}

      {/* Slide-over Drawer Interface */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl border-l border-[#E5E7EB] transition-transform duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FBFBFA] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1E1E24]">
                    SBCN AI Assistant
                  </h3>
                  <span className="rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#065F46] uppercase">
                    Counsel Online
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Grounded in Indian Companies Act, GST, EPFO/ESIC, & FEMA Regulations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#1F2937]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current Corporate Profile Badge */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] bg-[#FDF2F4]/40 px-4 py-2 text-[11px] text-[#5B061E]">
            <span>
              Target Profile: <strong>{profile.businessName}</strong> ({profile.entityType})
            </span>
            <span>
              {profile.exactHeadcount} Headcount • {profile.revenueThreshold}
            </span>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBFBFA]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#5B061E] text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#5B061E] text-white rounded-br-none'
                      : 'bg-white border border-[#E5E7EB] text-[#1E1E24] luxury-shadow-sm rounded-bl-none'
                  }`}
                >
                  <div className="prose prose-xs max-w-none text-[#1E1E24] dark:prose-invert">
                    <div
                      className="whitespace-pre-wrap font-sans"
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdownSimple(msg.text),
                      }}
                    />
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user' ? 'text-[#FDF2F4]/70' : 'text-[#9CA3AF]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && <span>{msg.source}</span>}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#4B5563] text-white">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Loader2 className="h-4 w-4 animate-spin text-[#5B061E]" />
                <span className="font-mono text-[11px]">
                  Consulting statutory regulations & synthesizing analysis...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Query Chips */}
          <div className="border-t border-[#E5E7EB] bg-[#FBFBFA] p-3">
            <span className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
              Statutory Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] font-medium text-[#374151] transition hover:border-[#5B061E] hover:bg-[#FDF2F4] hover:text-[#5B061E]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="border-t border-[#E5E7EB] bg-white p-3 sm:p-4">
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
                placeholder="Ask statutory question (e.g. GST late fees, PF thresholds)..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-[#E5E7EB] bg-[#FDFBFA] px-3.5 py-2 text-xs font-medium text-[#1E1E24] transition focus:border-[#5B061E] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B061E] text-white transition hover:bg-[#420415] disabled:opacity-40"
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

// Lightweight markdown formatter for chat responses
function formatMarkdownSimple(text: string): string {
  if (!text) return '';
  let formatted = text
    // Replace markdown headings
    .replace(/^### (.*$)/gim, '<h4 class="font-serif text-sm font-bold text-[#1E1E24] mt-2 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-serif text-base font-bold text-[#5B061E] mt-3 mb-1.5">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#111827]">$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="font-mono bg-gray-100 text-[#5B061E] px-1 py-0.5 rounded text-[11px]">$1</code>')
    // Bullet points
    .replace(/^\- (.*$)/gim, '<li class="ml-3 list-disc my-0.5 text-[#374151]">$1</li>');

  return formatted;
}
