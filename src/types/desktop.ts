// Window and Desktop Types
export interface WindowProps {
    app: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
}

export interface DesktopIconProps {
    iconSymbol: string;
    label: string;
    onClick: () => void;
}

export interface WindowType {
    id: number;
    app: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
}

export interface TaskbarProps {
    windows: WindowType[];
    minimizedApps: string[];
    onRestoreWindow: (app: string) => void;
    onMinimizeWindow: (id: number) => void;
}

// App-specific types
// Not used rn, might add later, or for other future app
export interface NotesAppProps {}

export interface TerminalAppProps {}