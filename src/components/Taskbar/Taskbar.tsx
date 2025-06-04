import type { TaskbarProps } from '../../types/desktop';
import { getAppIcon } from '../../utils/appUtils';

export const Taskbar = ({
                            windows,
                            minimizedApps,
                            onRestoreWindow,
                            onMinimizeWindow
                        }: TaskbarProps) => {
    return (
        <div className="taskbar">
            <button className="start-button">
                <img className="start-icon" src="/src/assets/opium-start-icon.svg" alt="start-icon" />
            </button>

            {/* Open app indicators */}
            {windows.map(window => (
                <button
                    key={window.id}
                    className={`taskbar-item ${minimizedApps.includes(window.app) ? 'minimized' : ''}`}
                    onClick={() =>
                        minimizedApps.includes(window.app)
                            ? onRestoreWindow(window.app)
                            : onMinimizeWindow(window.id)
                    }
                >
                    <span className="taskbar-icon">{getAppIcon(window.app)}</span>
                    <span className="taskbar-label">{window.title}</span>
                </button>
            ))}
        </div>
    );
};