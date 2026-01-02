import { Home, Camera, MessageCircle, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "home" | "camera" | "chat" | "history" | "recommendations";

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isLoggedIn: boolean;
}

const navItems = [
  { id: "home" as View, icon: Home, label: "Inicio" },
  { id: "camera" as View, icon: Camera, label: "Foto" },
  { id: "chat" as View, icon: MessageCircle, label: "Chat" },
  { id: "history" as View, icon: History, label: "Historial", requiresAuth: true },
  { id: "recommendations" as View, icon: Sparkles, label: "Tips", requiresAuth: true },
];

export function BottomNav({ currentView, onViewChange, isLoggedIn }: BottomNavProps) {
  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isLoggedIn
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom lg:hidden">
      <div className="container flex items-center justify-around h-20 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary/20 text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  isActive && "scale-110"
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
