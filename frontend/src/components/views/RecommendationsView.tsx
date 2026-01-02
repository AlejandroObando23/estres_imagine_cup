import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Wind, Moon, Leaf, Music, BookOpen, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: "breathing" | "mindfulness" | "activity" | "rest";
  effectiveness: number;
  saved: boolean;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Respiración 4-7-8",
    description: "Inhala 4s, mantén 7s, exhala 8s. Repite 4 veces para calmar tu sistema nervioso.",
    icon: Wind,
    category: "breathing",
    effectiveness: 92,
    saved: true,
  },
  {
    id: "2",
    title: "Meditación de 5 minutos",
    description: "Una breve sesión de mindfulness para reconectar contigo mismo.",
    icon: Moon,
    category: "mindfulness",
    effectiveness: 88,
    saved: true,
  },
  {
    id: "3",
    title: "Caminata consciente",
    description: "15 minutos de caminata enfocándote en tus sensaciones y el entorno.",
    icon: Leaf,
    category: "activity",
    effectiveness: 85,
    saved: false,
  },
  {
    id: "4",
    title: "Música relajante",
    description: "Escucha música a 432Hz para reducir la ansiedad y el estrés.",
    icon: Music,
    category: "rest",
    effectiveness: 78,
    saved: true,
  },
  {
    id: "5",
    title: "Journaling emocional",
    description: "Escribe 3 cosas por las que estás agradecido y cómo te sientes.",
    icon: BookOpen,
    category: "mindfulness",
    effectiveness: 82,
    saved: false,
  },
  {
    id: "6",
    title: "Pausa de café consciente",
    description: "Disfruta tu bebida sin distracciones, enfocándote en cada sorbo.",
    icon: Coffee,
    category: "rest",
    effectiveness: 75,
    saved: false,
  },
];

const categories = [
  { id: "all", label: "Todos", color: "bg-lavender-light" },
  { id: "breathing", label: "Respiración", color: "bg-sky-light" },
  { id: "mindfulness", label: "Mindfulness", color: "bg-mint-light" },
  { id: "activity", label: "Actividad", color: "bg-peach-light" },
  { id: "rest", label: "Descanso", color: "bg-rose-light" },
];

export function RecommendationsView() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [filter, setFilter] = useState<string>("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredRecommendations = recommendations.filter((rec) => {
    if (showSavedOnly && !rec.saved) return false;
    if (filter !== "all" && rec.category !== filter) return false;
    return true;
  });

  const toggleSaved = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, saved: !rec.saved } : rec))
    );
  };

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.id === category)?.color || "bg-muted";
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 bg-gradient-calm">
      <div className="container max-w-md lg:max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center lg:text-left py-4 lg:flex lg:items-center lg:gap-6">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-warm mb-3 lg:mb-0 shadow-soft">
            <Sparkles className="h-7 w-7 lg:h-8 lg:w-8 text-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2">
              Recomendaciones
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Técnicas personalizadas para tu bienestar
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant={showSavedOnly ? "lavender" : "outline"}
            size="sm"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="gap-2"
          >
            <Heart className={cn("h-4 w-4", showSavedOnly && "fill-current")} />
            Favoritos
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                filter === category.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Recommendations Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-12 lg:col-span-full">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {showSavedOnly
                  ? "No tienes favoritos guardados"
                  : "No hay recomendaciones en esta categoría"}
              </p>
            </div>
          ) : (
            filteredRecommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.id}
                  className="group relative overflow-hidden rounded-2xl bg-card shadow-soft border border-border/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          getCategoryColor(rec.category)
                        )}
                      >
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-foreground">
                            {rec.title}
                          </h3>
                          <button
                            onClick={() => toggleSaved(rec.id)}
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                          >
                            <Heart
                              className={cn(
                                "h-5 w-5 transition-colors",
                                rec.saved
                                  ? "fill-rose text-rose"
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                              style={{ width: `${rec.effectiveness}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {rec.effectiveness}% efectivo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
