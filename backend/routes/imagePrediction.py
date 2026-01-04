from fastapi import APIRouter, HTTPException
from models.imagePrediction import ImageRequest
from services.stress_service import get_stress_prediction

router = APIRouter(prefix="/api/imagePredict", tags=["Stress Prediction Image"])

# --- ENDPOINT ---
@router.post("/predict/image")
def predict_image(data: ImageRequest):
    try:
        # Llamamos a la lógica que está en el otro archivo
        result = get_stress_prediction(data.image)

        return {
            "status": "ok",
            "prediction": result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }