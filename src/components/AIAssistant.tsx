import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatSuggestions } from '../data/mockData';

interface AIAssistantProps {
  onClose?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your location analysis assistant. I can help you understand the data and insights about your selected location. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call OpenAI directly from frontend with improved context-aware prompt
  const fetchAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        return '⚠️ OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.';
      }

      // Build context string from available data
      let contextInfo = '';

      if (location) contextInfo += `\n📍 Location: ${location}`;
      if (businessType) contextInfo += `\n🏢 Business Type: ${businessType}`;
      if (successScore) contextInfo += `\n📊 Success Score: ${successScore}/100`;

      if (satelliteData?.statistics) {
        const stats = satelliteData.statistics;
        contextInfo += `\n\n🛰️ SATELLITE DATA:`;
        contextInfo += `\n• Change: ${stats.change_percentage?.toFixed(1)}%`;
        contextInfo += `\n• Pixels Changed: ${stats.changed_pixels?.toLocaleString()}`;
        contextInfo += `\n• Dates: ${satelliteData.before_date} to ${satelliteData.after_date}`;
        contextInfo += `\n• Model Confidence: ${(satelliteData.model_info?.confidence * 100)?.toFixed(0)}%`;
      }

      const systemPrompt = `You are BizLocate AI, an EXPERT location analysis assistant. Give DIRECT, DATA-DRIVEN answers with ZERO uncertainty.

🎯 ANALYSIS RULES:
**AIR QUALITY:** Change >5% = HIGH construction = POOR air quality. Change <2% = stable = GOOD air quality.
**PROFITABILITY:** High urban expansion + low competition = HIGH profit potential.
**HEALTH:** Vegetation increase = BETTER air. Vegetation decrease = WORSE air.

📋 FORMAT: Use emojis (📊 🛰️ 🌿 🏗️ 💰 🫁), bullet points, specific numbers. End with CLEAR verdict.

🚫 NEVER say "consult professionals". ✅ ALWAYS say "Based on the data, here's what you should do..."

${contextInfo ? `\nCURRENT CONTEXT:${contextInfo}` : ''}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await res.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not get a response.';
    } catch (err) {
      console.error('AI error:', err);
      return `⚠️ Error: ${err instanceof Error ? err.message : 'Could not contact AI service'}`;
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call OpenAI API directly
    const aiText = await fetchAIResponse(text);
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Messages - Garuda Style - FULLY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-4 space-y-4">
          {/* Header - SCROLLS WITH MESSAGES */}
          <div className="pb-4 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground">BizLocate AI</h2>
            <p className="text-sm max-w-sm text-muted-foreground">
              Ask questions about your location analysis results
            </p>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                  message.isUser
                    ? 'bg-white text-black'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.isUser ? 'U' : 'AI'}
              </div>
              <div
                className={`flex-1 space-y-2 ${message.isUser ? '' : ''}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-none break-words ${
                    message.isUser
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs mt-1.5 text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-lg">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Garuda Style */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about location analysis results..."
            className="flex-1 resize-none h-11 w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all overflow-hidden"
            disabled={isTyping}
            rows={1}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="h-11 w-11 bg-primary text-black rounded-lg hover:bg-primary/90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;