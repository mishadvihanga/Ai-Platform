import React, { useState, useRef, useEffect } from "react";

const JobChatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Career Assistant. How can I help you find your dream job today? 🎯" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const chatHistory = updatedMessages.slice(1); 

      const res = await fetch("http://localhost:5000/api/ai-bot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, chatHistory }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Could not connect to the AI server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 
      🛠️ FIX: හතරවටේ තිබුණු අනවශ්‍ය border, shadow සහ h-[550px] ඉවත් කර, 
      Parent popup එකටම ගැලපෙන සේ w-full h-full සහ flex-col යොදා සකස් කරන ලදි.
    */
    <div className="w-full h-full bg-white flex flex-col overflow-hidden font-sans">
      
      {/* Top Bar */}
      {/* pr-12 දමා ඇත්තේ App.js එකේ ✕ බටන් එක වැදීමේදී Title එක යට නොයෑමටයි */}
      <div className="bg-purple-600 p-4 text-white flex items-center gap-3 pr-12 shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl animate-pulse shrink-0">🤖</div>
        <div>
          <h3 className="font-bold text-sm tracking-wide">AI Job Assistant</h3>
          <p className="text-[11px] text-purple-200">Ask me about available vacancies & careers</p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
              msg.role === "user" 
                ? "bg-purple-600 text-white rounded-br-none" 
                : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
            }`}>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl p-3 rounded-bl-none flex items-center gap-1.5 shadow-sm text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      {/* shrink-0 යෙදීමෙන් Input කොටස කිසිවිටෙකත් යටින් සැඟවෙන්නේ (Squish වන්නේ) නැත */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about software jobs, locations..."
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-700"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default JobChatbot;