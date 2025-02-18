import { Button } from "@/components/ui/button";
import { useNotes } from "@/store/notes";
import { TrashIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

export default function Sidebar() {

  const [input, setInput] = useState('');

  const { notes, actions, focusingNote } = useNotes();
  const { saveNote, focusNote, unfocusNote, deleteNote } = actions;

  return (
    <div className='w-[20vw] border-r border-[#ddd] h-full p-2 flex flex-col'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() === '') return;
          const dateFormat = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          const note = { id: nanoid(), title: input, content: '', date: dateFormat };
          saveNote(note)
          setInput('');
        }}
        className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Empty"
          maxLength={50}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus:outline-0 h-10 text-center"
        />
        <Button
          variant="outline"
          type="submit"
          className="active:bg-gray-100 hover:bg-gray-50"
        >Create</Button>

        <p className="text-gray-800 py-2 my-2 border-b border-[#ddd] border-dashed">Notes</p>
      </form>

      <ul className="flex flex-col h-full overflow-y-auto gap-2 p-2 scroll-smooth scrollbar-thin">
        {notes.length === 0 ? <p className="w-full h-full flex justify-center items-center">It's empty here!</p> : notes.map(note => (
          <li key={note.id} className="w-full">
            <div
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (focusingNote?.id === note.id) {
                    unfocusNote();
                  } else {
                    focusNote(note);
                  }
                }
              }}
              onClick={() => {
                if (focusingNote?.id === note.id) {
                  unfocusNote();
                } else {
                  focusNote(note);
                }
              }}
              className={`${focusingNote?.id === note.id ? "bg-gray-50" : null} focus-visible:outline-blue-500 cursor-default w-full border border-[#ddd] rounded-md px-2 py-1 overflow-hidden shadow-xs`}>
              <p className="truncate">{note.title}</p>
              <div className="flex justify-between items-center">
                <span className="truncate text-xs text-gray-500">{note.date}</span>
                <button onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (focusingNote?.id === note.id) {
                    unfocusNote();
                    deleteNote(note.id);
                  } else {
                    deleteNote(note.id);
                  }
                }} className="p-1.5 rounded-full hover:bg-[#f0f0f0] group cursor-pointer">
                  {/* cursor-pointer here maybe */}
                  <TrashIcon size={12} className="text-red-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
