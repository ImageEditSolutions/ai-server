import React, {useRef, useState} from "react";

// API 호출 함수
const generateImage = async (prompt) => {
  const apiKey = process.env.REACT_APP_HUGGINGFACE_TOKEN;

  if (!apiKey) throw new Error("Missing API key.");

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const result = await response.blob();  // API는 보통 JSON 응답을 제공
    return result;

  } catch (error) {
    console.error("API 호출 오류:", error);
  }
};

const App = () => {
  const [prompt, setPrompt] = useState(""); // 프롬프트 입력 값
  const [imageUrl, setImageUrl] = useState(null); // 생성된 이미지 URL
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const handleGenerate = async () => {
    try {
      const prompt = "A futuristic city at sunset"; // 테스트용 프롬프트
      const image = await generateImage(prompt);
      const imageUrl = URL.createObjectURL(image);
      if (imageUrl) {
        console.log("이미지 생성 성공:", imageUrl);
        // 이미지를 화면에 렌더링하거나 처리하는 코드
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error("handleGenerate에서 오류 발생:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleGenerate();
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Stable Diffusion Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          style={{ width: "300px", padding: "10px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "10px" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Image:</h3>
          <img
            src={imageUrl}
            alt="Generated from prompt"
            style={{ maxWidth: "80%" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
