import { Button } from "@/components/ui/button";
import { Camera, MessageCircle, TrendingUp, Heart, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeViewProps {
  isLoggedIn: boolean;
  onNavigate: (view: "camera" | "chat") => void;
  recentAnalyses?: Array<{
    id: string;
    type: "photo" | "chat";
    stressLevel: number;
    date: string;
  }>;
}

export function HomeView({ isLoggedIn, onNavigate, recentAnalyses = [] }: HomeViewProps) {
  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 bg-gradient-calm">
      <div className="container max-w-md lg:max-w-5xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="text-center lg:text-left py-6 lg:py-8 lg:flex lg:items-center lg:justify-between lg:bg-card lg:rounded-2xl lg:px-8 lg:shadow-card lg:border lg:border-border/50">
          <div className="lg:flex lg:items-center lg:gap-6">
            <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-primary mb-4 lg:mb-0 animate-float shadow-elevated">
              <Brain className="h-10 w-10 lg:h-12 lg:w-12 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {isLoggedIn ? "¡Hola de nuevo!" : "Bienvenido a StressBot"}
              </h2>
              <p className="text-muted-foreground lg:text-lg">
                Evalúa tu nivel de estrés de forma sencilla
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground italic">"La calma es la cuna del poder interior"</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <button
            onClick={() => onNavigate("camera")}
            className="group relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-card shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-3 lg:gap-4">
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-lavender-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-7 w-7 lg:h-10 lg:w-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-semibold lg:text-lg text-foreground">
                  Análisis Facial
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">
                  Toma una foto y analiza tu estrés
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate("chat")}
            className="group relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-card shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-mint/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-3 lg:gap-4">
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-mint-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-7 w-7 lg:h-10 lg:w-10 text-secondary-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-semibold lg:text-lg text-foreground">
                  Chat de Bienestar
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">
                  Conversa con nuestro asistente
                </p>
              </div>
            </div>
          </button>

          {/* Desktop only extra cards */}
          <div className="hidden lg:flex flex-col gap-4 col-span-2">
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-sky-light to-lavender-light shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-card/80 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg text-foreground">Seguimiento Continuo</h3>
                  <p className="text-sm text-muted-foreground">Monitorea tu progreso y mejora tu bienestar día a día</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-peach-light to-rose-light shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-card/80 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-rose" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg text-foreground">Recomendaciones Personalizadas</h3>
                  <p className="text-sm text-muted-foreground">Técnicas de relajación adaptadas a tus necesidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses - Only for logged in users */}
        {isLoggedIn && recentAnalyses.length > 0 && (
          <div className="space-y-3 lg:space-y-4 animate-fade-in-up lg:bg-card lg:rounded-2xl lg:p-6 lg:shadow-card lg:border lg:border-border/50" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-display font-semibold lg:text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
              Análisis recientes
            </h3>
            <div className="space-y-2 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
              {recentAnalyses.slice(0, 3).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center gap-4 p-4 lg:p-5 rounded-xl bg-card lg:bg-muted/30 shadow-soft lg:shadow-none border border-border/50 lg:border-0 lg:hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={cn(
                      "w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center",
                      analysis.type === "photo" ? "bg-lavender-light" : "bg-mint-light"
                    )}
                  >
                    {analysis.type === "photo" ? (
                      <Camera className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                    ) : (
                      <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-secondary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm lg:text-base text-foreground">
                      {analysis.type === "photo" ? "Análisis facial" : "Conversación"}
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart
                      className={cn(
                        "h-4 w-4 lg:h-5 lg:w-5",
                        analysis.stressLevel < 40
                          ? "text-mint"
                          : analysis.stressLevel < 70
                          ? "text-peach"
                          : "text-rose"
                      )}
                    />
                    <span className="text-sm lg:text-base font-medium">{analysis.stressLevel}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote - Mobile only */}
        <div className="lg:hidden p-5 rounded-2xl bg-gradient-to-r from-lavender-light via-sky-light to-mint-light shadow-soft border border-border/30 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-center text-sm text-foreground/80 italic font-medium">
            "La calma es la cuna del poder interior"
          </p>
        </div>
      </div>
    </div>
  );
}
