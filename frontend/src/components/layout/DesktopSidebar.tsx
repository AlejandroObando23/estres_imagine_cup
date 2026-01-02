import { Home, Camera, MessageCircle, History, Sparkles, LogOut, User, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type View = "home" | "camera" | "chat" | "history" | "recommendations";

interface DesktopSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: "home" as View, icon: Home, label: "Inicio" },
  { id: "camera" as View, icon: Camera, label: "Análisis Foto" },
  { id: "chat" as View, icon: MessageCircle, label: "Chat" },
  { id: "history" as View, icon: History, label: "Historial", requiresAuth: true },
  { id: "recommendations" as View, icon: Sparkles, label: "Recomendaciones", requiresAuth: true },
];

export function DesktopSidebar({ currentView, onViewChange, isLoggedIn, onLogin, onLogout }: DesktopSidebarProps) {
  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isLoggedIn
  );

  return (
    <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-card border-r border-border/50 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">StressBot</h1>
          <p className="text-xs text-muted-foreground">Tu bienestar importa</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="pt-6 border-t border-border/50">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-lavender-light flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">Usuario</p>
                <p className="text-xs text-muted-foreground">Cuenta activa</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <Button
            variant="gradient"
            className="w-full gap-2"
            onClick={onLogin}
          >
            <User className="h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>
    </aside>
  );
}
