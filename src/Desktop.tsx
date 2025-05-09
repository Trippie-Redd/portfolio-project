import { useState, useEffect } from 'react';
import './CSS/Desktop.css';

// Define application types
type WindowProps = {
    app: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
};

type DesktopIconProps = {
    iconSymbol: string;
    label: string;
    onClick: () => void;
};

type WindowType = {
    id: number;
    app: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
};

// Define basic application components
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

const TerminalApp = () => {
    const [history, setHistory] = useState<string[]>(['Welcome to Terminal!', 'Type "help" for commands']);
    const [input, setInput] = useState<string>('');
  
    const handleCommand = () => {
    let response;
    switch (input.toLowerCase().trim()) {
        case 'help':
        response = 'Available commands: help, clear, date, whoami';
        break;
        case 'clear':
        setHistory([]);
        setInput('');
        return;
        case 'date':
        response = new Date().toString();
        break;
        case 'whoami':
        response = 'Desktop User';
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

// Window component
const Window = ({ app, title, position, size, zIndex, onClose, onMinimize, onFocus }: WindowProps) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [windowPosition, setWindowPosition] = useState<{ x: number; y: number }>(position);

    const startDrag = (e: React.MouseEvent) => {
    onFocus();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    });
    e.preventDefault();
    };

    const onDrag = (e: MouseEvent) => {
    if (isDragging) {
        setWindowPosition({
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y)
        });
    }
    };

    const stopDrag = () => {
    setIsDragging(false);
    };

    // Set up event listeners for dragging
    useEffect(() => {
    if (isDragging) {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        return () => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        };
    }
    }, [isDragging]);

    // Render the appropriate app component
    const renderApp = () => {
    switch (app) {
        case 'notes':
        return <NotesApp />;
        case 'terminal':
        return <TerminalApp />;
        default:
        return <div className="default-app">App content here</div>;
    }
    };

    return (
    <div 
        className="window"
        style={{ 
        left: windowPosition.x, 
        top: windowPosition.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex
        }}
        onClick={onFocus}
    >
        <div 
        className="window-titlebar"
        onMouseDown={startDrag}
        >
        <span className="window-icon">{getAppIcon(app)}</span>
        <span className="window-title">{title}</span>
        <div className="window-controls">
            <button onClick={onMinimize} className="window-button window-minimize">
            −
            </button>
            <button onClick={onClose} className="window-button window-close">
            ×
            </button>
        </div>
        </div>
        <div className="window-content">
        {renderApp()}
        </div>
    </div>
    );
};

// Helper function to get app icon
const getAppIcon = (app: string): string => {
    switch (app) {
    case 'notes':
        return '📝';
    case 'terminal':
        return '🖥️';
    default:
        return '📄';
    }
};

// Desktop Icon component
const DesktopIcon = ({ iconSymbol, label, onClick }: DesktopIconProps) => {
    return (
    <div 
        className="desktop-icon"
        onClick={onClick}
    >
        <div className="icon-symbol">{iconSymbol}</div>
        <div className="icon-label">{label}</div>
    </div>
    );
};

const StartMenu = () => {

}

// Main Desktop component
const Desktop = () => {
    const [windows, setWindows] = useState<WindowType[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
    const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
    const [maxZIndex, setMaxZIndex] = useState<number>(1);

    const openApp = (app: string, title: string) => {
    // Check if app is already open
    const existingWindow = windows.find(w => w.app === app);
    if (existingWindow) {
        // If minimized, unminimize it
        if (minimizedApps.includes(app)) {
        setMinimizedApps(minimizedApps.filter(a => a !== app));
        }
        focusWindow(existingWindow.id);
        return;
    }

    // Calculate position with offset for cascade effect
    const offset = windows.length * 30;
    const newZIndex = maxZIndex + 1;

    const newWindow: WindowType = {
        id: Date.now(),
        app,
        title,
        position: { x: 100 + offset, y: 50 + offset },
        size: getAppSize(app),
        zIndex: newZIndex
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setMaxZIndex(newZIndex);
    };

    const getAppSize = (app: string): { width: number; height: number } => {
    switch (app) {
        case 'notes':
        return { width: 400, height: 300 };
        case 'calculator':
        return { width: 280, height: 360 };
        case 'terminal':
        return { width: 500, height: 300 };
        default:
        return { width: 400, height: 300 };
    }
    };

    const closeWindow = (id: number) => {
    const window = windows.find(w => w.id === id);
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
        setActiveWindowId(windows.length > 1 ? windows[windows.length - 2].id : null);
    }

    // Remove from minimized if it was minimized
    if (window) {
        setMinimizedApps(minimizedApps.filter(a => a !== window.app));
    }
    };

    const minimizeWindow = (id: number) => {
    const window = windows.find(w => w.id === id);
    if (window) {
        setMinimizedApps([...minimizedApps, window.app]);
        
        // Set focus to next window if this was active
        if (activeWindowId === id) {
        const nonMinimizedWindows = windows.filter(w => 
            w.id !== id && !minimizedApps.includes(w.app)
        );
        if (nonMinimizedWindows.length > 0) {
            focusWindow(nonMinimizedWindows[nonMinimizedWindows.length - 1].id);
        } else {
            setActiveWindowId(null);
        }
        }
    }
    };

    const restoreWindow = (app: string) => {
    setMinimizedApps(minimizedApps.filter(a => a !== app));
    const window = windows.find(w => w.app === app);
    if (window) {
        focusWindow(window.id);
    }
    };

    const focusWindow = (id: number) => {
    if (id === activeWindowId) return;

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);

    setWindows(
        windows.map(window => {
        if (window.id === id) {
            return { ...window, zIndex: newZIndex };
        }
        return window;
        })
    );

    setActiveWindowId(id);
    };

    return (
    <div className="desktop">
        {/* Desktop area */}
        <div className="desktop-area">
        {/* Desktop icons */}
        <div className="desktop-icons">
            <DesktopIcon 
            iconSymbol="📝" 
            label="Notes" 
            onClick={() => openApp('notes', 'Notes')} 
            />
            <DesktopIcon 
            iconSymbol="🖥️" 
            label="Terminal" 
            onClick={() => openApp('terminal', 'Terminal')} 
            />
        </div>
        
        {/* Windows */}
        {windows.map(window => (
            !minimizedApps.includes(window.app) && (
            <Window 
                key={window.id}
                app={window.app}
                title={window.title}
                position={window.position}
                size={window.size}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onFocus={() => focusWindow(window.id)}
            />
            )
        ))}
        </div>
        
        {/* Taskbar/Dock */}
        <div className="taskbar">
        <button className="start-button">
            <img className="start-icon" src="/src/assets/opium-start-icon.svg" alt="start-icon" />
        </button>
        
        {/* Open app indicators */}
        {windows.map(window => (
            <button 
            key={window.id}
            className={`taskbar-item ${minimizedApps.includes(window.app) ? 'minimized' : ''}`}
            onClick={() => minimizedApps.includes(window.app) ? restoreWindow(window.app) : minimizeWindow(window.id)}
            >
            <span className="taskbar-icon">{getAppIcon(window.app)}</span>
            <span className="taskbar-label">{window.title}</span>
            </button>
        ))}
        </div>
    </div>
    );
};

export default Desktop;
