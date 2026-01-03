import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

class StressDetector:
    def __init__(self, model_path, cascade_path):
        self.model = load_model(model_path)
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        self.labels = ["Non-Stress", "Stress", "Neutral"]
        self.img_size = 224

    def _preprocess_face(self, face_img):
        face_img = cv2.resize(face_img, (self.img_size, self.img_size))
        face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
        face_array = np.expand_dims(face_img, axis=0)
        face_array = preprocess_input(face_array)
        return face_array

    def predict_with_face_detection(self, image_path):
        img = cv2.imread(image_path)

        if img is None:
            return [], "Imagen no válida"

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5
        )

        results = []

        for (x, y, w, h) in faces:
            face = img[y:y+h, x:x+w]
            face_array = self._preprocess_face(face)

            preds = self.model.predict(face_array)[0]

            non_stress, stress, neutral = preds

            # 🔥 UMBRALES (CLAVE)
            if stress > 0.6:
                label = "Stress"
                confidence = stress
            elif non_stress > 0.6:
                label = "Non-Stress"
                confidence = non_stress
            else:
                label = "Neutral"
                confidence = neutral

            results.append({
                "label": label,
                "confidence": float(confidence),
                "raw_predictions": {
                    "Non-Stress": float(non_stress),
                    "Stress": float(stress),
                    "Neutral": float(neutral)
                }
            })

        return results, None
