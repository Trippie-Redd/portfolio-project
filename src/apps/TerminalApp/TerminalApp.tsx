import { useState } from 'react';
import type { TerminalAppProps } from '../../types/desktop';

// eslint-disable-next-line no-empty-pattern
export const TerminalApp = ({}: TerminalAppProps) => {
    const [history, setHistory] = useState<string[]>([
        'Welcome to Terminal!',
        'Type "help" for commands'
    ]);
    const [input, setInput] = useState<string>('');

    const handleCommand = () => {
        let response: string;

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