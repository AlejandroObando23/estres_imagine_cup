import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X, Loader2 } from "lucide-react";

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onAnalysisComplete?: (result: { stressLevel: number; message: string }) => void;
}

export function CameraView({ onCapture, onAnalysisComplete }: CameraViewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara. Por favor, permite el acceso.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(async () => {
    if (capturedImage) {
      setIsAnalyzing(true);
      onCapture(capturedImage);
      
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockResult = {
        stressLevel: Math.floor(Math.random() * 60) + 20,
        message: "Basado en tu expresión facial, parece que tienes un nivel moderado de estrés. Te recomendamos tomar un descanso.",
      };
      
      setIsAnalyzing(false);
      onAnalysisComplete?.(mockResult);
    }
  }, [capturedImage, onCapture, onAnalysisComplete]);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 bg-gradient-calm">
      <div className="container max-w-md lg:max-w-4xl mx-auto lg:flex lg:gap-8 lg:items-start space-y-6 lg:space-y-0 animate-fade-in">
        {/* Left Column - Camera */}
        <div className="lg:flex-1 space-y-6">
          <div className="text-center lg:text-left py-4">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2">
              Análisis por Foto
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Toma una foto de tu rostro para analizar tu nivel de estrés
            </p>
          </div>

        {/* Camera Preview */}
        <div className="relative aspect-square lg:aspect-video lg:max-h-[500px] rounded-3xl overflow-hidden bg-card shadow-elevated border border-border/50">
          {!stream && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/50">
              <div className="w-20 h-20 rounded-full bg-lavender-light flex items-center justify-center">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <Button variant="gradient" size="lg" onClick={startCamera}>
                Activar cámara
              </Button>
              {error && (
                <p className="text-destructive text-sm text-center px-4">{error}</p>
              )}
            </div>
          )}

          {stream && !capturedImage && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-foreground/50 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 text-primary-foreground animate-spin" />
              <p className="text-primary-foreground font-medium">
                Analizando...
              </p>
            </div>
          )}

          {/* Face guide overlay */}
          {stream && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 border-4 border-dashed border-primary/50 rounded-[100px] animate-pulse-soft" />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {stream && !capturedImage && (
            <>
              <Button variant="outline" size="icon-lg" onClick={stopCamera}>
                <X className="h-6 w-6" />
              </Button>
              <Button variant="gradient" size="icon-lg" onClick={takePhoto}>
                <Camera className="h-6 w-6" />
              </Button>
            </>
          )}

          {capturedImage && !isAnalyzing && (
            <>
              <Button variant="outline" size="icon-lg" onClick={retakePhoto}>
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button variant="gradient" size="icon-lg" onClick={confirmPhoto}>
                <Check className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
        </div>

        {/* Right Column - Tips (Desktop) */}
        <div className="lg:w-80 lg:sticky lg:top-8 space-y-4">
          <div className="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-card shadow-soft border border-border/50">
            <h4 className="font-display font-semibold text-sm lg:text-base mb-2 lg:mb-4">Consejos para mejores resultados:</h4>
            <ul className="text-xs lg:text-sm text-muted-foreground space-y-1 lg:space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Asegúrate de tener buena iluminación
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Mantén tu rostro centrado en el marco
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Intenta mostrar una expresión natural
              </li>
            </ul>
          </div>

          <div className="hidden lg:block p-6 rounded-2xl bg-gradient-to-r from-lavender-light to-sky-light border border-border/30">
            <h4 className="font-display font-semibold text-base mb-2">¿Cómo funciona?</h4>
            <p className="text-sm text-muted-foreground">
              Nuestro sistema analiza tus expresiones faciales para detectar signos de estrés 
              y proporcionarte recomendaciones personalizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
