import { useState } from 'react';
import type { WindowType } from '../../types/desktop';
import { DesktopIcon } from '../DesktopIcon';
import { Window } from '../Window';
import { Taskbar } from '../Taskbar';
import '../../CSS/Desktop.css';

export const Desktop = () => {
    const [windows, setWindows] = useState<WindowType[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
    const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
    const [maxZIndex, setMaxZIndex] = useState<number>(1);

    const openApp = (app: string, title: string, size: { width: number, height: number }) => {
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
            size,
            zIndex: newZIndex
        };

        setWindows([...windows, newWindow]);
        setActiveWindowId(newWindow.id);
        setMaxZIndex(newZIndex);
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
                        onClick={() => openApp('notes', 'Notes', { width: 400, height: 300 })}
                    />
                    <DesktopIcon
                        iconSymbol="🖥️"
                        label="Terminal"
                        onClick={() => openApp('terminal', 'Terminal', { width: 500, height: 300 })}
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
            <Taskbar
                windows={windows}
                minimizedApps={minimizedApps}
                onRestoreWindow={restoreWindow}
                onMinimizeWindow={minimizeWindow}
            />
        </div>
    );
};