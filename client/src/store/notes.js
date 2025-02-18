import { create } from 'zustand';

export const useNotes = create((set) => ({
    notes: [],
    focusingNote: null,
    actions: {
        focusNote: (note) => {
            console.log('focusing: ', note);
            set({ focusingNote: note })
        },

        unfocusNote: () => {
            set({ focusingNote: null });
        },

        saveNote: (note) => {
            set((state) => ({ notes: state.notes.some(n => n.id === note.id) ? state.notes : [...state.notes, note] }));
        },  // if any element passes (not unique) the condition it immediately returns true

        editNote: (note) => {
            set((state) => ({
                notes: state.notes.map(n => (
                    n.id === note.id ? { ...n, ...note } : n // if id matches replace it with the passed values otherwise keep it same
                ))
            }));
        },

        deleteNote: (id) => {
            set((state) => ({
                notes: state.notes.filter(note => note.id !== id)   // if it matches just exclude it
            }))
        }
    }
}));