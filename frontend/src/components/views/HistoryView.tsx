import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, MessageCircle, Trash2, Heart, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  type: "photo" | "chat";
  date: string;
  stressLevel: number;
  preview?: string;
  summary?: string;
}

interface HistoryViewProps {
  onDeleteItem?: (id: string) => void;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "photo",
    date: "Hoy, 10:30",
    stressLevel: 35,
    preview: "Análisis facial completado",
  },
  {
    id: "2",
    type: "chat",
    date: "Hoy, 09:15",
    stressLevel: 45,
    summary: "Conversación sobre estrés laboral",
  },
  {
    id: "3",
    type: "photo",
    date: "Ayer, 18:00",
    stressLevel: 55,
    preview: "Análisis facial completado",
  },
  {
    id: "4",
    type: "chat",
    date: "Ayer, 14:30",
    stressLevel: 40,
    summary: "Ejercicios de respiración",
  },
  {
    id: "5",
    type: "photo",
    date: "Mar 15, 20:00",
    stressLevel: 65,
    preview: "Análisis facial completado",
  },
];

export function HistoryView({ onDeleteItem }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [filter, setFilter] = useState<"all" | "photo" | "chat">("all");

  const filteredHistory = history.filter(
    (item) => filter === "all" || item.type === filter
  );

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    onDeleteItem?.(id);
  };

  const getStressColor = (level: number) => {
    if (level < 40) return "text-mint";
    if (level < 70) return "text-peach";
    return "text-rose";
  };

  const getStressLabel = (level: number) => {
    if (level < 40) return "Bajo";
    if (level < 70) return "Moderado";
    return "Alto";
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 bg-gradient-calm">
      <div className="container max-w-md lg:max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center lg:text-left py-4 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2">
              Tu Historial
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Revisa tus análisis anteriores
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-muted/50 lg:w-fit">
          {[
            { id: "all", label: "Todos" },
            { id: "photo", label: "Fotos", icon: Camera },
            { id: "chat", label: "Chats", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "all" | "photo" | "chat")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300",
                filter === tab.id
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 lg:col-span-full">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No hay registros aún</p>
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-card shadow-soft border border-border/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      item.type === "photo" ? "bg-lavender-light" : "bg-mint-light"
                    )}
                  >
                    {item.type === "photo" ? (
                      <Camera className="h-6 w-6 text-primary" />
                    ) : (
                      <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">
                        {item.type === "photo" ? "Análisis facial" : "Conversación"}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          item.stressLevel < 40
                            ? "bg-mint-light text-secondary-foreground"
                            : item.stressLevel < 70
                            ? "bg-peach-light text-foreground"
                            : "bg-rose-light text-foreground"
                        )}
                      >
                        {getStressLabel(item.stressLevel)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.summary || item.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Heart className={cn("h-4 w-4", getStressColor(item.stressLevel))} />
                      <span className="text-sm font-semibold">{item.stressLevel}%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
