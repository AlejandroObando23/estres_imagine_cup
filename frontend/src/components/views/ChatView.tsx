import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatViewProps {
  onNewMessage?: (message: Message) => void;
}

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: "¡Hola! 👋 Soy tu asistente de bienestar. Cuéntame, ¿cómo te sientes hoy? Estoy aquí para ayudarte a evaluar y manejar tu estrés.",
  timestamp: new Date(),
};

const mockResponses = [
  "Entiendo cómo te sientes. Es completamente normal experimentar esos sentimientos. ¿Podrías contarme más sobre qué situaciones específicas te generan más estrés?",
  "Gracias por compartir eso conmigo. Basándome en lo que me cuentas, parece que estás experimentando un nivel moderado de estrés. Te recomiendo tomar pausas cortas durante el día. ¿Te gustaría que te sugiera algunos ejercicios de relajación?",
  "Es importante reconocer nuestras emociones. Un ejercicio que puede ayudarte es la respiración profunda: inhala por 4 segundos, mantén por 4 segundos, y exhala por 6 segundos. ¿Lo intentamos juntos?",
  "Me alegra que estés buscando ayuda. Recuerda que cuidar de tu salud mental es tan importante como la física. ¿Hay algo específico que te gustaría trabajar hoy?",
];

export function ChatView({ onNewMessage }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    onNewMessage?.(userMessage);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
    onNewMessage?.(assistantMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-0 lg:pb-0 flex flex-col bg-gradient-calm">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border/50 glass lg:bg-card">
        <div className="container max-w-md lg:max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
            <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold lg:text-lg text-foreground">Asistente de Bienestar</h2>
            <p className="text-xs lg:text-sm text-muted-foreground">Siempre disponible para ti</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 lg:py-6">
        <div className="container max-w-md lg:max-w-2xl mx-auto space-y-4 lg:space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" && "flex-row-reverse"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={cn(
                  "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "assistant"
                    ? "bg-lavender-light"
                    : "bg-mint-light"
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                ) : (
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-secondary-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] lg:max-w-[70%] p-4 lg:p-5 rounded-2xl shadow-soft",
                  message.role === "assistant"
                    ? "bg-card rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                <p className="text-sm lg:text-base leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-2",
                    message.role === "assistant"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-lavender-light flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-card shadow-soft">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 lg:py-4 border-t border-border/50 glass lg:bg-card safe-bottom">
        <div className="container max-w-md lg:max-w-2xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe cómo te sientes..."
            className="flex-1 h-12 lg:h-14 px-4 lg:px-6 rounded-xl lg:rounded-2xl bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all lg:text-base"
          />
          <Button
            variant="gradient"
            size="icon"
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
