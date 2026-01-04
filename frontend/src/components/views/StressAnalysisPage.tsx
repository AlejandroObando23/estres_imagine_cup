import { useState } from "react";
import { CameraView } from "./CameraView"; // Asegúrate de que la ruta sea correcta
import { AnalysisResultView } from "./AnalysisResultView"; // Asegúrate de que la ruta sea correcta

// Definimos la estructura de lo que responde tu servidor FastAPI
interface ServerResponse {
  stress_score: number;
  nivel: string;
}

export default function StressAnalysisPage() {
  // 'step' controla qué vista mostrar: 'capture' (cámara) o 'result' (resultado)
  const [step, setStep] = useState<"capture" | "result">("capture");
  
  // Guardamos la respuesta del servidor aquí
  const [analysisData, setAnalysisData] = useState<{
    score: number;
    level: string;
  } | null>(null);

  // Esta función se ejecuta cuando CameraView recibe la respuesta del API
  const handleAnalysisComplete = (data: ServerResponse) => {
    setAnalysisData({
      score: Math.round(data.stress_score), // Convertimos ej: 75.5 a 76
      level: data.nivel,
    });
    setStep("result"); // Cambiamos automáticamente a la vista de resultados
  };

  // Función para volver a empezar
  const handleReset = () => {
    setAnalysisData(null);
    setStep("capture");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      {step === "capture" ? (
        <div className="w-full animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Analizador de Estrés</h1>
            <p className="text-slate-400">Captura una foto de tu rostro para medir tu nivel de estrés actual</p>
          </div>
          
          {/* Le pasamos la función al hijo para que nos devuelva el resultado */}
          <CameraView onAnalysisComplete={handleAnalysisComplete} />
        </div>
      ) : (
        <div className="w-full animate-in zoom-in-95 duration-500">
          {analysisData && (
            <AnalysisResultView
              stressLevel={analysisData.score}
              message={`Según el análisis de tu expresión facial, tu nivel de estrés es ${analysisData.level}.`}
              type="photo"
              onContinue={() => console.log("Usuario continuó")}
              onTryAgain={handleReset}
            />
          )}
        </div>
      )}
    </div>
  );
}