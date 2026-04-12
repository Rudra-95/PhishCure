import React, { useState } from 'react';
import './InputSection.css';

const InputSection = ({ onAnalyze }) => {
  const [inputType, setInputType] = useState('url'); // url or text
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAnalyze({ type: inputType, value: inputValue });
  };

  return (
    <div className="input-hero">
      <div className="hero-text">
        <h1>Truth at your fingertips.</h1>
        <p>Analyze articles, websites, and claims using advanced LLMs and cross-referenced fact-checking.</p>
      </div>
      
      <div className="glass-panel input-card">
        <div className="type-toggle">
          <button 
            className={inputType === 'url' ? 'active' : ''} 
            onClick={() => setInputType('url')}
          >
            Article URL
          </button>
          <button 
            className={inputType === 'text' ? 'active' : ''} 
            onClick={() => setInputType('text')}
          >
            Raw Text
          </button>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          {inputType === 'url' ? (
            <input 
              type="url" 
              placeholder="https://example.com/news-article..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          ) : (
            <textarea 
              placeholder="Paste the article text or claim here..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              rows="5"
            />
          )}
          
          <button type="submit" className="btn-primary analyze-btn">
            Analyze Content
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputSection;
