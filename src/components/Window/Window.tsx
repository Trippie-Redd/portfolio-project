import type { WindowProps } from '../../types/desktop';
import { getAppIcon } from '../../utils/appUtils';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { NotesApp, TerminalApp } from '../../apps';

export const Window = ({
                           app,
                           title,
                           position,
                           size,
                           zIndex,
                           onClose,
                           onMinimize,
                           onFocus
                       }: WindowProps) => {
    const { windowPosition, startDrag } = useWindowDrag(position);

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
                onMouseDown={(e) => startDrag(e, onFocus)}
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