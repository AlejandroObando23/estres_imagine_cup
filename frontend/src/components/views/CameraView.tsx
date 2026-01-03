import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  RotateCcw,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Tipado para el resultado que esperas
interface AnalysisResult {
  stress_score: number;
  nivel: string;
  probabilidades?: {
    stress: number;
  };
}

export function CameraView({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para guardar el resultado localmente si lo necesitas mostrar aquí
  const [analysis, setAnalysis] = useState<{
    stressLevel: number;
    message: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
      };
    }
    // Cleanup: detener cámara al desmontar el componente
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const analyzeImage = async () => {
    if (!capturedImage) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch("http://localhost:8000/predict/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });

      if (!response.ok) throw new Error("Error al analizar la imagen");

      const result: AnalysisResult = await response.json();

      // Formateamos la data para el estado local y el callback
      const formattedData = {
        stressLevel: Math.round(result.stress_score),
        message: `Tu nivel de estrés es ${result.nivel}`,
      };

      setAnalysis(formattedData);
      
      // Notificamos al padre
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo analizar la imagen. Intenta nuevamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setAnalysis(null); // Limpiar análisis previo
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
    } catch (err) {
      setError("No se pudo activar la cámara. Revisa los permisos.");
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.85));
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Contenedor de Video/Imagen */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-white/10">
        {stream && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay playsInline muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[35%] aspect-[3/4] border-2 border-dashed border-white/60 rounded-[100%] shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]" />
            </div>
          </>
        )}

        {capturedImage && (
          <img src={capturedImage} alt="Captura" className="absolute inset-0 w-full h-full object-cover" />
        )}

        {!stream && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur">
            {error ? (
              <div className="text-center p-4">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-white">{error}</p>
                <Button onClick={startCamera} className="mt-4">Reintentar</Button>
              </div>
            ) : (
              <Button onClick={startCamera} size="lg" className="rounded-full">
                <Camera className="mr-2" /> Activar Cámara
              </Button>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Mostrar Resultado si existe */}
      {analysis && !isAnalyzing && (
        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 w-full">
           <span className="text-3xl lg:text-4xl font-bold text-primary">
            {analysis.stressLevel}%
          </span>
          <p className="text-muted-foreground">{analysis.message}</p>
        </div>
      )}

      {/* Controles */}
      <div className="flex gap-4">
        {stream && (
          <Button onClick={takePhoto} size="lg" className="h-16 w-16 rounded-full">
            <Camera className="w-8 h-8" />
          </Button>
        )}

        {capturedImage && (
          <>
            <Button
              variant="outline"
              disabled={isAnalyzing}
              onClick={() => {
                setCapturedImage(null);
                setAnalysis(null);
                startCamera();
              }}
            >
              <RotateCcw className="mr-2" /> Repetir
            </Button>

            <Button onClick={analyzeImage} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <><Loader2 className="mr-2 animate-spin" /> Analizando...</>
              ) : (
                <><Check className="mr-2" /> Analizar Rostro</>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}