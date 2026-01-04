import base64
import uuid
import os
import sys

sys.path.append(os.getcwd()) 
from DeepLearning.stress_detector_model import StressDetector

TEMP_DIR = "DeepLearning/imagenes_prueba"
os.makedirs(TEMP_DIR, exist_ok=True)

print("Cargando modelo de IA...")
detector = StressDetector()
detector.load_model("DeepLearning/stress_model.h5") 

def get_stress_prediction(base64_string: str):
    """
    Lógica pura: Recibe string, procesa y devuelve resultado.
    """
    filename = f"{uuid.uuid4()}.jpg"
    image_path = os.path.join(TEMP_DIR, filename)

    try:
        # 1. Limpiar y Decodificar
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        image_bytes = base64.b64decode(base64_string)

        # 2. Guardar
        with open(image_path, "wb") as f:
            f.write(image_bytes)

        # 3. Predecir
        result = detector.predict_stress(image_path)
        
        return result

    finally:
        # 4. Limpieza (Opcional: borrar la imagen después de usarla)
        if os.path.exists(image_path):
            os.remove(image_path)