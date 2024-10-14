import React, { useState } from "react";

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
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    console.log(process.env.REACT_APP_HUGGINGFACE_TOKEN); // 콘솔에서 출력되는지 확인
    console.log("사용자 입력 프롬프트:", prompt);
    console.log("응답 상태 코드:", response.status);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("API 응답:", data);
    return data;

    const blob = await response.blob(); // 이미지 데이터를 Blob으로 받음
    return URL.createObjectURL(blob); // Blob을 URL로 변환해 반환
  } catch (error) {
    console.error("API 호출 오류:", error);
    alert("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
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
      if (image) {
        console.log("이미지 생성 성공:", image);
        // 이미지를 화면에 렌더링하거나 처리하는 코드
      }
    } catch (error) {
      console.error("handleGenerate에서 오류 발생:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Stable Diffusion Image Generator</h1>
      <form onSubmit={handleGenerate}>
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
