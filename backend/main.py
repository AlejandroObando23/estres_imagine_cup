from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import numpy as np
import uuid
import os

from stress_detector_model import StressDetector

app = FastAPI()

# ✅ CORS (OBLIGATORIO para React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción se restringe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELO ----------
detector = StressDetector()
detector.load_model("models/stress_model_final.h5")

# ---------- SCHEMA ----------
class ImageRequest(BaseModel):
    image: str  # base64

# ---------- ENDPOINT ----------
@app.post("/predict/image")
def predict_image(data: ImageRequest):
    # 1. Limpiar base64
    image_data = data.image.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    # 2. Convertir a imagen OpenCV
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # 3. Guardar temporalmente (tu modelo lo usa así)
    os.makedirs("temp", exist_ok=True)
    filename = f"temp/{uuid.uuid4()}.jpg"
    cv2.imwrite(filename, img)

    # 4. Predicción
    result = detector.predict_stress(filename)

    # 5. Limpiar
    os.remove(filename)

    return result
