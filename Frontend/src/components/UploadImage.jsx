import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [mode, setMode] = useState("upload"); // 'upload' or 'camera'

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "environment",
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setCapturedImage(URL.createObjectURL(e.target.files[0])); // preview
  };

  const captureFromWebcam = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // Convert base64 to File
    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], "captured.jpg", { type: mimeString });
    setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Please capture or select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:5001/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('Ingrredients : ',res.data.ingredients);
      
      const recipe=await axios.post("http://localhost:3000/ai/get-recipe",{ingredients:res.data.ingredients});
       
      console.log('recipe : ',recipe.data.recipe);
      

      setIngredients(res.data.ingredients);
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Food Detection</h1>

      {/* Mode Switch */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setMode("upload")}>Upload from Computer</button>
        <button onClick={() => setMode("camera")}>Capture from Webcam</button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      )}

      {/* Webcam Mode */}
      {mode === "camera" && (
        <div>
          <Webcam
            audio={false}
            height={600}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={800}
            videoConstraints={videoConstraints}
          />
          <button onClick={captureFromWebcam}>📸 Capture Photo</button>
        </div>
      )}

      {/* Image Preview */}
      {capturedImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview:</h3>
          <img src={capturedImage} alt="Captured or Uploaded" width="300" />
        </div>
      )}

      {/* Upload to Server */}
      <div style={{ marginTop: 20 }}>
        <button onClick={handleUpload}>🚀 Detect Ingredients</button>
      </div>

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Detected Ingredients:</h2>
          <ul>
            {ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
