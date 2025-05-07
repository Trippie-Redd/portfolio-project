import { useState } from 'react'
import './CSS/App.css'
import './CSS/Desktop.css';

// Define window child properties
type WindowProps = {
  app: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  onClose:    () => void;
  onMinimize: () => void;
  onFocus:    () => void;
};

// Define icon properties
type DesktopIconProps = {
  iconSymbol: string;
  label: string;
  onClick: () => void;
};

// Define window type properties
type WindowType = {
  id: number;
  app: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
};

// Notes app definition
const NotesApp = () => {
  const [notes, setNotes] = useState<string>('Welcome to Notes!');
  
  return (
    <div className="notes-app">
      <div className="app-header">Notes</div>
      <textarea 
        className="notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

// Terminal app defintion
const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to Terminal!', 'Type "help" for commands']);
  const [input, setInput]     = useState<string>('');
  
  const handleCommand = () => {
    let response;
    switch (input.toLowerCase().trim()) {
      case 'help':
        response = 'Available commands: help, clear, date, do nothing';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        response = new Date().toString();
        break;
      case 'do nothing':
        response = 'did nothing';
        break;
      default:
        response = `Command not found: ${input}`;
    }
    
    setHistory([...history, `$ ${input}`, response]);
    setInput('');
  };

  return (
    <div className="terminal-app">
      <div className="app-header">Terminal</div>
      <div className="terminal-output">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="terminal-input">
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand();
            }
          }}
          className="terminal-input-field"
          autoFocus
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <>
    
    </>
  )
}

export default App