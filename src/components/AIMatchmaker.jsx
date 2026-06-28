import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const TMDB_API_KEY = "4fdd0d59a1f17e38b912e065674f80d8";

export default function AIMatchmaker() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi there! I'm your AI Movie Matchmaker. Tell me what kind of movie or TV show you're looking for! For example: 'I want a mind-bending thriller similar to Inception.'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { lang } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
      }

      const prompt = `You are an expert movie and TV show recommender AI. 
      The user will give you a prompt: "${userText}"
      You must recommend exactly 3 titles that best match their criteria.
      Return your response EXCLUSIVELY as a valid JSON array of objects. Do not wrap it in markdown block quotes.
      Each object must have the following format:
      {
        "title": "Movie or Show Title",
        "year": 2010,
        "type": "movie",
        "reason": "Why you recommend this (1-2 short sentences)"
      }`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      let recommendations = [];
      try {
        const textResponse = data.candidates[0].content.parts[0].text;
        recommendations = JSON.parse(textResponse);
      } catch (err) {
        console.error("Failed to parse Gemini JSON:", err);
        throw new Error("Failed to parse the AI's response.");
      }

      // Fetch TMDB data for each recommendation
      const enrichedRecommendations = await Promise.all(recommendations.map(async (rec) => {
        try {
          const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/${rec.type || 'movie'}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(rec.title)}&year=${rec.year}&language=${lang}`);
          const tmdbData = await tmdbRes.json();
          if (tmdbData.results && tmdbData.results.length > 0) {
            const match = tmdbData.results[0];
            return {
              ...rec,
              id: match.id,
              poster_path: match.poster_path,
              vote_average: match.vote_average,
            };
          }
          return rec;
        } catch (err) {
          console.error("Failed to fetch TMDB for", rec.title);
          return rec;
        }
      }));

      setMessages((prev) => [...prev, { role: "model", recommendations: enrichedRecommendations }]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Sparkles size={24} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transition-all duration-300 transform origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '600px', maxHeight: 'calc(100vh - 3rem)' }}>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <h3 className="font-bold">AI Matchmaker</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 bg-white/20 hover:bg-white/40 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'}`}>
                {msg.text && <p>{msg.text}</p>}
                
                {msg.recommendations && (
                  <div className="space-y-3 mt-2">
                    <p className="font-medium mb-3">Here is what I recommend:</p>
                    {msg.recommendations.map((rec, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all">
                        {rec.id ? (
                          <Link to={`/${rec.type || 'movie'}/${rec.id}`} className="flex p-3 gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="w-16 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                              {rec.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Film size={20} className="text-slate-400"/></div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{rec.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <span>{rec.year}</span>
                                {rec.vote_average > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">
                                      ⭐ {rec.vote_average.toFixed(1)}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-snug">{rec.reason}</p>
                            </div>
                          </Link>
                        ) : (
                          <div className="p-3">
                            <h4 className="font-bold text-slate-900 dark:text-white">{rec.title} ({rec.year})</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">{rec.reason}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a recommendation..."
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm shadow-sm border border-slate-200 dark:border-slate-700"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-full transition-colors shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
