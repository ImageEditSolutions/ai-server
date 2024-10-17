import React, { useState } from 'react';
import generateImages from './generateImages';

function App() {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('none'); // 필터 상태
  const [aspectRatio, setAspectRatio] = useState('4 / 3'); // 비율 상태

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const imageURLs = await generateImages({ text: prompt, numImages });
      setImages(imageURLs);
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to generate images. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Stability AI Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />
      <br />

      <input
        type="number"
        value={numImages}
        onChange={(e) => setNumImages(Number(e.target.value))}
        min={1}
        max={5}
        style={{ marginBottom: '20px' }}
      />
      <br />

      <label>Choose Image Style: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="none">None</option>
        <option value="grayscale(100%)">Grayscale</option>
        <option value="sepia(100%)">Sepia</option>
        <option value="blur(5px)">Blur</option>
        <option value="brightness(0.5)">Darken</option>
      </select>

      <br />
      <label>Select Aspect Ratio: </label>
      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ marginBottom: '20px' }}>
        <option value="4 / 3">4:3</option>
        <option value="3 / 4">3:4</option>
        <option value="1 / 1">1:1 (Square)</option>
        <option value="16 / 9">16:9</option>
        <option value="9 / 16">9:16</option>
      </select>

      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Images'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              display: 'inline-block',
              margin: '10px',
              aspectRatio: aspectRatio,
              width: '300px',
              overflow: 'hidden',
              borderRadius: '10px',
            }}
          >
            <img
              src={img}
              alt={`Generated ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter,
                transition: 'filter 0.3s',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
