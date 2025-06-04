// Helper function to get app icon
export const getAppIcon = (app: string): string => {
    switch (app) {
        case 'notes':
            return '📝';
        case 'terminal':
            return '🖥️';
        default:
            return '📄';
    }
};