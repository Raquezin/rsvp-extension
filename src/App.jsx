import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [speed, setSpeed] = useState(300)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef(null)

  const intervalRef = useRef(null)

  const calculatedTotalTime = words.length > 0 ? (words.length * 60) / speed : 0

  // Load text from chrome storage if available
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.session.get('pageText', (result) => {
        if (result.pageText) {
          setText(result.pageText);
          const wordArray = result.pageText.trim().split(/\s+/);
          setWords(wordArray);
          chrome.storage.session.remove('pageText');
        }
      });
    }
  }, [speed])



  // Playback timer
  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length) {
      const interval = 60000 / speed // ms per word
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev + 1 >= words.length) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
        setElapsedTime(prev => prev + interval / 1000)
      }, interval)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, words, currentWordIndex])

  // Helper to process word into Left-Pivot-Right for ORP
  const getWordParts = useCallback((word) => {
    if (!word) return { left: '', pivot: '', right: '' };
    const len = word.length;
    let pivotIdx = 0;
    
    // ORP heuristics
    if (len === 1) pivotIdx = 0;
    else if (len >= 2 && len <= 5) pivotIdx = 1;
    else if (len >= 6 && len <= 9) pivotIdx = 2;
    else if (len >= 10 && len <= 13) pivotIdx = 3;
    else pivotIdx = 4;

    if (pivotIdx >= len) pivotIdx = len - 1;

    return {
      left: word.substring(0, pivotIdx),
      pivot: word[pivotIdx],
      right: word.substring(pivotIdx + 1)
    };
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentWordIndex(0)
    setElapsedTime(0)
  }, [])

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText)
    setIsPlaying(false)
    
    if (newText.trim()) {
      const wordArray = newText.trim().split(/\s+/)
      setWords(wordArray)
      setCurrentWordIndex(0)
      setElapsedTime(0)
    } else {
      setWords([])
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        setText(content)
        setIsPlaying(false)
        const wordArray = content.trim().split(/\s+/)
        setWords(wordArray)
        setCurrentWordIndex(0)
        setElapsedTime(0)
      }
      reader.readAsText(file)
    }
  }

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value))
  }

  const togglePlay = useCallback(() => {
    if (words.length === 0) return;
    
    if (currentWordIndex >= words.length - 1 && !isPlaying) {
      setCurrentWordIndex(0);
      setElapsedTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [words, currentWordIndex, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          togglePlay();
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setSpeed(prev => Math.min(prev + 10, 1000));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setSpeed(prev => Math.max(prev - 10, 10));
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, reset]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = words.length ? (currentWordIndex / (words.length - 1)) * 100 : 0
  const remainingTime = calculatedTotalTime - elapsedTime

  const currentWord = words[currentWordIndex] || '';
  const { left, pivot, right } = getWordParts(currentWord);

  return (
    <main className={darkMode ? 'dark' : ''}>
      <div className="app-container">
        <header className="header-controls">
          <div className="header-title">RSVP Reader</div>
          <div className="header-actions">
            <span className="speed-badge">{speed} WPM</span>
            <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="toggle-button" onClick={() => setShowCustomInput(!showCustomInput)}>
              {showCustomInput ? 'Hide Settings' : 'Settings'}
            </button>
          </div>
        </header>
        
        {showCustomInput && (
          <section className="options-panel">
            <div className="input-group">
              <label htmlFor="text-input">Reader Content</label>
              <textarea
                id="text-input"
                placeholder="Paste text here or use the extension icon on any webpage..."
                value={text}
                onChange={handleTextChange}
                rows={4}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label htmlFor="file-input">Upload Text File</label>
                <input
                  type="file"
                  id="file-input"
                  accept=".txt"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
              <div className="input-group">
                <label htmlFor="speed-input">Speed (WPM)</label>
                <input
                  type="number"
                  id="speed-input"
                  min="10"
                  max="1000"
                  step="10"
                  value={speed}
                  onChange={handleSpeedChange}
                />
              </div>
            </div>
          </section>
        )}

        <div className="word-display" onClick={togglePlay}>
          <div className="word-reader">
            <span style={{ textAlign: 'right', flex: 1 }}>{left}</span>
            <span className="pivot" style={{ flex: '0 0 auto', padding: '0 2px' }}>{pivot}</span>
            <span style={{ textAlign: 'left', flex: 1 }}>{right}</span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="stats-row">
          <span>{formatTime(elapsedTime)}</span>
          <span>{words.length > 0 ? `${currentWordIndex + 1} / ${words.length}` : '0 / 0'}</span>
          <span>-{formatTime(remainingTime > 0 ? remainingTime : 0)}</span>
        </div>

        <footer className="footer-controls">
          <div className="button-group">
            <button className="btn btn-primary" disabled={words.length === 0} onClick={togglePlay}>
              {isPlaying ? 'Pause' : (currentWordIndex > 0 ? 'Resume' : 'Start')}
            </button>
            <button className="btn btn-secondary" onClick={reset} disabled={words.length === 0}>
              Reset
            </button>
          </div>
          <div className="shortcuts-hint">
            Space: Play/Pause • Arrows: Speed • Click word to toggle
          </div>
        </footer>
      </div>
    </main>
  )
}

export default App
