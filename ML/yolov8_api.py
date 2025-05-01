# yolov8_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8m.pt")  # Use yolov8n for speed; fine-tune a custom model for better food detection

@app.route("/detect", methods=["POST"])
def detect_ingredients():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    image_path = os.path.join("uploads", image.filename)
    image.save(image_path)

    results = model(image_path)[0]
    detected_labels = list(set([model.names[int(cls)] for cls in results.boxes.cls.tolist()]))

    os.remove(image_path)
    return jsonify({"ingredients": detected_labels})

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(port=5001, debug=True)
