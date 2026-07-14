import { useState } from "react";
import {
  Bot,
  MessageCircle,
  Send,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { usePuterStore } from "~/lib/puter";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const FloatingChat = () => {
  const { ai } = usePuterStore();

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Resume Assistant. Ask me anything about resumes, ATS scores, interviews, career advice, or cover letters.",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setInput("");
    setLoading(true);

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: "Thinking...",
      },
    ]);

    try {
      const response = await ai.chat(
        [
          {
            role: "system",
            content: `
You are an AI Resume Assistant.

You specialize in:
- Resume improvements
- ATS optimization
- Resume rewriting
- Cover letters
- Interview preparation
- Career advice
- Job search guidance

Keep answers concise, professional and actionable.
            `,
          },

          ...updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        {
          model: "gpt-4.1-mini",
        }
      );

      const rawContent = response?.message?.content;

      const aiReply =
        typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
          ? rawContent
              .map((item: any) => item.text || item.content || "")
              .join("")
          : "Sorry, I couldn't generate a response.";

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: aiReply,
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Floating Button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div
            className="
              rounded-full
              border
              border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              shadow-xl
              animate-pulse
              dark:bg-slate-800
              dark:border-slate-700
              dark:text-gray-200
            "
          >
            💬 Ask me anything!
          </div>
  
          <button
            onClick={() => setOpen(true)}
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-indigo-500
              to-purple-600
              text-white
              shadow-2xl
              transition-all
              duration-300
              hover:scale-110
              hover:shadow-indigo-500/40
            "
          >
            <MessageCircle size={28} />
          </button>
        </div>
      )}
  
      {/* Chat Window */}
      {open && (
        <div
          className={`
            fixed
            z-50
            flex
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            transition-all
            duration-300
  
            dark:bg-slate-900
            dark:border-slate-700
  
            ${
              fullscreen
                ? "top-5 left-5 right-5 bottom-5"
                : "bottom-24 right-6 h-[550px] w-[390px]"
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-700">
  
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-2 text-white">
                <Bot size={20} />
              </div>
  
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI Resume Assistant
                </h3>
  
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask anything about resumes
                </p>
              </div>
            </div>
  
            {/* Window Controls */}
            <div className="flex items-center gap-2">
  
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-slate-800"
                title={
                  fullscreen
                    ? "Exit Fullscreen"
                    : "Fullscreen"
                }
              >
                {fullscreen ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
              </button>
  
              <button
                onClick={() => {
                  setOpen(false);
                  setFullscreen(false);
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                title="Close"
              >
                <X size={18} />
              </button>
  
            </div>
          </div>


                  {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 bg-gray-50 dark:bg-slate-950">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white text-gray-700 shadow-sm dark:bg-slate-800 dark:text-gray-200"
                  : "ml-auto bg-indigo-600 text-white"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            <input
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder={
                loading ? "Waiting for AI..." : "Ask anything..."
              }
              className="
                flex-1
                border-0
                bg-transparent
                outline-none
                text-gray-800
                placeholder:text-gray-400
                dark:text-white
                dark:placeholder:text-gray-500
                disabled:opacity-50
              "
            />

            <button
              disabled={loading}
              onClick={sendMessage}
              className="
                rounded-xl
                bg-indigo-600
                p-2
                text-white
                transition
                hover:bg-indigo-700
                disabled:opacity-50
              "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default FloatingChat;