from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import uuid
import os

from stress_detector_model import StressDetector

app = FastAPI(title="StressGuard DeepLearning API")

# =========================
# CORS (OBLIGATORIO PARA REACT)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # En producción pon tu dominio
    allow_credentials=True,
    allow_methods=["*"],        # Permite OPTIONS, POST, etc.
    allow_headers=["*"],
)

# =========================
# Cargar modelo una sola vez
# =========================
detector = StressDetector()
detector.load_model("stress_model.h5")

# =========================
# Carpeta temporal
# =========================
TEMP_DIR = "imagenes_prueba"
os.makedirs(TEMP_DIR, exist_ok=True)

# =========================
# Modelo de entrada
# =========================
class ImageRequest(BaseModel):
    image: str  # base64


# =========================
# Endpoint de predicción
# =========================
@app.post("/predict/image")
def predict_image(data: ImageRequest):
    """
    Recibe una imagen en base64 y predice estrés
    """
    try:
        # Limpiar base64 (por si viene con data:image/jpeg;base64,)
        image_base64 = data.image.split(",")[-1]
        image_bytes = base64.b64decode(image_base64)

        # Guardar imagen temporal
        filename = f"{uuid.uuid4()}.jpg"
        image_path = os.path.join(TEMP_DIR, filename)

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        # Predicción
        result = detector.predict_stress(image_path)

        return {
            "status": "ok",
            "prediction": result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
