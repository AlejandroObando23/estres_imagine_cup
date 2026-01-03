import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultViewProps {
  stressLevel: number; // 0 - 100
  message: string;
  type: "photo" | "chat";
  onContinue: () => void;
  onTryAgain: () => void;
}

export function AnalysisResultView({
  stressLevel,
  message,
  type,
  onContinue,
  onTryAgain,
}: AnalysisResultViewProps) {
  console.log("type of analysis result view:", type);
  console.log("stress level:", stressLevel);
  

  const getStressLabel = () => {
    if (stressLevel < 0.40) return "Bajo";
    if (stressLevel < 0.70) return "Moderado";
    return "Alto";
  };

  const getStressEmoji = () => {
    if (stressLevel < 0.40) return "😊";
    if (stressLevel < 0.70) return "😐";
    return "😟";
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-0 lg:pb-0 px-4 bg-gradient-calm flex items-center justify-center">
      <div className="container max-w-md lg:max-w-2xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">

        {/* RESULT CARD */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-elevated border border-border/50 text-center">

          {/* STRESS METER */}
          <div className="relative w-40 h-40 lg:w-52 lg:h-52 mx-auto mb-6 lg:mb-8">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${stressLevel * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    className={cn(
                      stressLevel < 40
                        ? "text-mint"
                        : stressLevel < 70
                        ? "text-peach"
                        : "text-rose"
                    )}
                    style={{ stopColor: "currentColor" }}
                  />
                  <stop
                    offset="100%"
                    className={cn(
                      stressLevel < 40
                        ? "text-mint/70"
                        : stressLevel < 70
                        ? "text-peach/70"
                        : "text-rose/70"
                    )}
                    style={{ stopColor: "currentColor" }}
                  />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl lg:text-5xl mb-1">
                {getStressEmoji()}
              </span>
              <span className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                {stressLevel}%
              </span>
            </div>
          </div>

<h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
  Nivel de estrés: {getStressLabel()}
</h2>

<p className="text-muted-foreground lg:text-lg mb-6 lg:mb-8">
  {message}
</p>

          {/* QUICK TIP */}
          <div className="bg-muted/50 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                Recomendación rápida
              </h3>
            </div>

            <p className="text-sm text-muted-foreground">
              {stressLevel < 40
                ? "¡Excelente! Mantén tus hábitos actuales y sigue cuidando tu bienestar."
                : stressLevel < 70
                ? "Intenta hacer una pausa de 5 minutos con ejercicios de respiración profunda."
                : "Busca un lugar tranquilo y practica la respiración 4-7-8 para reducir el estrés."}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={onTryAgain}
          >
            <RefreshCcw className="h-5 w-5" />
            Repetir
          </Button>

          <Button
            variant="gradient"
            size="lg"
            className="flex-1 gap-2"
            onClick={onContinue}
          >
            Continuar
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
