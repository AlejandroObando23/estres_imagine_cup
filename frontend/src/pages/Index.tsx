import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { HomeView } from "@/components/views/HomeView";
import { CameraView } from "@/components/views/CameraView";
import { ChatView } from "@/components/views/ChatView";
import { HistoryView } from "@/components/views/HistoryView";
import { RecommendationsView } from "@/components/views/RecommendationsView";
import { LoginView } from "@/components/views/LoginView";
import { AnalysisResultView } from "@/components/views/AnalysisResultView";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type View = "home" | "camera" | "chat" | "history" | "recommendations" | "login" | "result";

interface AnalysisResult {
  stressLevel: number;
  message: string;
  type: "photo" | "chat";
}

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const mockRecentAnalyses = [
    { id: "1", type: "photo" as const, stressLevel: 35, date: "Hoy, 10:30" },
    { id: "2", type: "chat" as const, stressLevel: 45, date: "Ayer, 15:00" },
    { id: "3", type: "photo" as const, stressLevel: 55, date: "Mar 15, 09:00" },
  ];

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setCurrentView("home");
    toast({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión correctamente.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setCurrentView("home");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo captured");
  };

  const handleAnalysisComplete = (result: { stressLevel: number; message: string }) => {
    setAnalysisResult({ ...result, type: "photo" });
    setCurrentView("result");
  };

  const handleNavigateFromHome = (view: "camera" | "chat") => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginView
            onLogin={handleLogin}
            onBack={() => setCurrentView("home")}
          />
        );
      case "result":
        return analysisResult ? (
          <AnalysisResultView
            stressLevel={analysisResult.stressLevel}
            message={analysisResult.message}
            type={analysisResult.type}
            onContinue={() => setCurrentView("home")}
            onTryAgain={() => setCurrentView(analysisResult.type === "photo" ? "camera" : "chat")}
          />
        ) : null;
      case "camera":
        return (
          <CameraView
            onCapture={handlePhotoCapture}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case "chat":
        return <ChatView />;
      case "history":
        return <HistoryView />;
      case "recommendations":
        return <RecommendationsView />;
      default:
        return (
          <HomeView
            isLoggedIn={isLoggedIn}
            onNavigate={handleNavigateFromHome}
            recentAnalyses={isLoggedIn ? mockRecentAnalyses : []}
          />
        );
    }
  };

  const showNavigation = currentView !== "login" && currentView !== "result";

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      {showNavigation && (
        <DesktopSidebar
          currentView={currentView as "home" | "camera" | "chat" | "history" | "recommendations"}
          onViewChange={(view) => setCurrentView(view)}
          isLoggedIn={isLoggedIn}
          onLogin={() => setCurrentView("login")}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {showNavigation && (
          <Header
            isLoggedIn={isLoggedIn}
            onLogin={() => setCurrentView("login")}
            onLogout={handleLogout}
          />
        )}
        
        <main className="flex-1">
          {renderView()}
        </main>

        {showNavigation && (
          <BottomNav
            currentView={currentView as "home" | "camera" | "chat" | "history" | "recommendations"}
            onViewChange={(view) => setCurrentView(view)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
