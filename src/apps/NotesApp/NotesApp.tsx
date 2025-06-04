import { useState } from 'react';
import type { NotesAppProps } from '../../types/desktop';

// eslint-disable-next-line no-empty-pattern
export const NotesApp = ({}: NotesAppProps) => {
    const [notes, setNotes] = useState<string>('Welcome to Notes!');

    return (
        <div className="notes-app">
            <div className="app-header">Notes</div>
            <textarea
                className="notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Start typing your notes..."
            />
        </div>
    );
};