import { Button } from "@/components/ui/button";
import { User, LogOut, Brain } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ isLoggedIn, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 safe-top lg:hidden">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-lg text-foreground">
            StressBot
          </h1>
        </div>

        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            className="text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="lavender"
            size="sm"
            onClick={onLogin}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  );
}
