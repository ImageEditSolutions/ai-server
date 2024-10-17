interface generateImagesProps {
    text: string;
    style?: string;
    numImages?: number; // 유저가 이미지 개수를 지정할 수 있도록 추가
  }
  
  const generateImages = async ({ text, style, numImages = 1 }: generateImagesProps) => {
    const engineId = 'stable-diffusion-v1-6';
    const apiHost = 'https://api.stability.ai';
    const apiKey = process.env.REACT_APP_STABILITY_API_KEY;
  
    if (!apiKey) throw new Error('Missing Stability API key.');
  
    const requestBody = {
      text_prompts: [{ text }],
      cfg_scale: 7,
      steps: 30,
      samples: numImages, // 이미지 개수 설정
      style_preset: style,
    };
  
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }
  
    const responseJSON = await response.json();
    return responseJSON.artifacts.map((artifact: any) => `data:image/png;base64,${artifact.base64}`);
  };
  
  export default generateImages;
  