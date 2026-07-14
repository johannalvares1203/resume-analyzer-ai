import { useState, useRef, useEffect } from "react";
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

const MODELS = [
  {
    value: "gpt-4.1-mini",
    label: "GPT-4.1 Mini ⚡",
  },
  {
    value: "gpt-4.1-nano",
    label: "GPT-4.1 Nano 🚀",
  },
  {
    value: "claude-3-7-sonnet",
    label: "Claude 3.7 Sonnet 🧠",
  },
  {
    value: "claude-3-5-haiku",
    label: "Claude 3.5 Haiku ⚡",
  },
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash ⚡",
  },
];

const FloatingChat = () => {
  const { ai } = usePuterStore();

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [model, setModel] = useState("gpt-4.1-mini");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Resume Assistant. Ask me anything about resumes, ATS scores, interviews, career advice, or cover letters.",
    },
  ]);

  // -----------------------------
  // Draggable Floating Button
  // -----------------------------

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("floating-chat-position");

    if (saved) return JSON.parse(saved);

    return {
      x: window.innerWidth - 120,
      y: window.innerHeight - 110,
    };
  });

  const dragging = useRef(false);
  const moved = useRef(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const mouseStart = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    localStorage.setItem(
      "floating-chat-position",
      JSON.stringify(position)
    );
  }, [position]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    dragging.current = true;
    moved.current = false;

    dragStart.current = {
      x: position.x,
      y: position.y,
    };

    mouseStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;

    const dx = e.clientX - mouseStart.current.x;
    const dy = e.clientY - mouseStart.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      moved.current = true;
    }

    setPosition({
      x: dragStart.current.x + dx,
      y: dragStart.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;

    window.removeEventListener(
      "mousemove",
      handleMouseMove
    );

    window.removeEventListener(
      "mouseup",
      handleMouseUp
    );

    if (!moved.current) {
      setOpen(true);
    }
  };

  // -----------------------------
  // AI Chat
  // -----------------------------

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
          model,
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
        <div
          className="fixed z-50 flex items-center gap-3 select-none"
          style={{
            left: position.x,
            top: position.y,
            cursor: dragging.current ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
        >
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
                : ""
            }
          `}
          style={
            fullscreen
              ? {}
              : {
                  left: Math.max(position.x - 320, 20),
                  top: Math.max(position.y - 480, 20),
                  width: 390,
                  height: 550,
                }
          }
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-5 dark:border-slate-700">
            <div className="flex items-start justify-between">
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
  
                  {/* Model Selector */}
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      AI Model
                    </label>
  
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={loading}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-indigo-500
                        dark:border-slate-600
                        dark:bg-slate-800
                        dark:text-white
                        disabled:opacity-50
                      "
                    >
                      {MODELS.map((m) => (
                        <option
                          key={m.value}
                          value={m.value}
                        >
                          {m.label}
                        </option>
                      ))}
                    </select>
  
                    <p className="mt-1 text-[11px] text-gray-400">
                      Current model{" "}
                      <span className="font-medium text-indigo-500">
                        {model}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-slate-800"
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
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
  
          {/* Messages */}


                  {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5 dark:bg-slate-950">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white text-gray-700 shadow-sm dark:bg-slate-800 dark:text-gray-200"
                  : "ml-auto bg-indigo-600 text-white"
              }`}
            >
              {msg.content === "Thinking..." ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              ) : (
                msg.content
              )}
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
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                loading
                  ? `Waiting for ${model}...`
                  : "Ask anything about resumes..."
              }
              className="
                flex-1
                border-0
                bg-transparent
                text-gray-800
                outline-none
                placeholder:text-gray-400
                dark:text-white
                dark:placeholder:text-gray-500
                disabled:opacity-50
              "
            />

            <button
              disabled={loading || !input.trim()}
              onClick={sendMessage}
              className="
                rounded-xl
                bg-indigo-600
                p-2
                text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Send size={18} />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>Powered by {model}</span>

            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    )}
  </>
);

};

export default FloatingChat;