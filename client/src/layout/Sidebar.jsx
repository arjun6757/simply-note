import { Button } from "@/components/ui/button";
import { useNotes } from "@/store/notes";
import { DeleteIcon, LogOutIcon, UserIcon } from "@/components/icons/Icons";
import { nanoid } from "nanoid";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useEffect } from "react";
import LoadingSpinner from "@/components/loader";
import { useAuth } from "@/context/AuthProvider";

export default function Sidebar() {

  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const { notes, actions, focusingNote } = useNotes();
  const { saveNote, focusNote, unfocusNote, deleteNote } = actions;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, setUser } = useAuth();

  // not needed since user is already handled by context api for now!
  // useEffect(() => {
  //   async function fetchUser() {
  //     setLoading(true);
  //     const { data, error } = await supabase.auth.getUser();

  //     if (error) {
  //       setLoading(false);
  //       setMessage(error.message);
  //       return;
  //     }

  //     if (data?.user) {
  //       const { user } = data;
  //       setUser(user);
  //     }

  //     setLoading(false);
  //   }

  //   fetchUser();
  // }, []);

  const handleLogOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      console.error(error.message);
      setMessage(error.message);
    } else {
      setLoading(false);
      // navigate(0); 
      // => Refresh the page while staying on the same route
      // => we don't need it since react automatically does it for us via context api
    }
  }

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
          autoFocus
          type="text"
          placeholder="Enter a title"
          maxLength={50}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus:outline-0 h-10 text-center"
        />
        <Button
          variant="outline"
          type="submit"
          className="active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"
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
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (focusingNote?.id === note.id) {
                      unfocusNote();
                      deleteNote(note.id);
                    } else {
                      deleteNote(note.id);
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-[#f0f0f0] cursor-pointer group focus-visible:outline-blue-500">
                  <DeleteIcon className="w-3 h-3 text-red-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="w-full mt-2 border border-[#ddd] rounded-md shadow-xs">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="outline-gray-500 outline-offset-4 w-full flex gap-2 justify-start shadow-none items-center h-10 p-1.5 hover:bg-[#f0f0f0] rounded-md"
          >
            <div className="h-8 w-8 bg-linear-to-br from-indigo-500 to-pink-500 rounded-md"></div>
            <span className="text-gray-700">{user ? user.user_metadata.username : 'username'}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={4} className={'font-inter mb-2 lg:w-[14rem] drop-shadow-xs'}>
            <DropdownMenuLabel>{user ? user.user_metadata.email : 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon />
              Team
            </DropdownMenuItem>
            {user ? (
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOutIcon />
                Log out
                {loading && <LoadingSpinner />}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => navigate('/login')} >
                <LogOutIcon />
                Log in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  )
}
