import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

export const AiChatModal: React.FC = () => {
  const {
    showAiChat,
    setShowAiChat,
    aiChatMessages,
    setAiChatMessages,
    aiChatInput,
    setAiChatInput,
    isAiChatLoading,
    setIsAiChatLoading
  } = useAppContext();

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAiChat && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, showAiChat]);

  const handleSendAiMessage = async () => {
    if (!aiChatInput.trim()) return;
    
    const userMessage = aiChatInput.trim();
    setAiChatInput('');
    setAiChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Je bent een behulpzame, motiverende en deskundige fitness coach voor de app "DAELY Performance". 
      Geef een kort, bondig en praktisch antwoord op de volgende vraag van een gebruiker. 
      Gebruik een vriendelijke toon en emojis waar gepast.
      
      Vraag: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiChatMessages(prev => [...prev, { role: 'ai', text: response.text || "Sorry, ik kon even geen antwoord bedenken." }]);
    } catch (error) {
      console.error("Error generating chat response:", error);
      setAiChatMessages(prev => [...prev, { role: 'ai', text: "Er ging iets mis met de verbinding. Probeer het later nog eens!" }]);
    } finally {
      setIsAiChatLoading(false);
    }
  };

  if (!showAiChat) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-black/50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in" onClick={() => setShowAiChat(false)}>
      <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md h-[85vh] sm:h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <h3 className="font-black text-lg">Smart Coach</h3>
              <p className="text-xs font-bold text-emerald-500">Altijd online</p>
            </div>
          </div>
          <button onClick={() => setShowAiChat(false)} className="p-2 bg-zinc-100 rounded-full active-scale">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50 hide-scrollbar">
          {aiChatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-white border border-zinc-100 text-zinc-900 rounded-bl-sm shadow-sm'}`}>
                <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>strong]:font-bold">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isAiChatLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-zinc-100">
          <div className="flex gap-2 relative">
            <input 
              type="text" 
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              placeholder="Stel je vraag..."
              className="flex-1 bg-zinc-100 rounded-full px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-14"
            />
            <button 
              onClick={handleSendAiMessage}
              disabled={!aiChatInput.trim() || isAiChatLoading}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 rounded-full flex items-center justify-center text-white active-scale disabled:opacity-50 disabled:active-scale-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
