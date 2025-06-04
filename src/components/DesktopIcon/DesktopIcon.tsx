import type { DesktopIconProps } from '../../types/desktop';

export const DesktopIcon = ({ iconSymbol, label, onClick }: DesktopIconProps) => {
    return (
        <div
            className="desktop-icon"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
        >
            <div className="icon-symbol">{iconSymbol}</div>
            <div className="icon-label">{label}</div>
        </div>
    );
};