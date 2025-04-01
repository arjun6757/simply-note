"use client";

import { Button } from "@/components/ui/button";
import { useNotes } from "@/zustand/notes";
import { LogOutIcon, UserIcon } from "@/components/icons/Icons";
import { nanoid } from "nanoid";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import Avatar from "@/components/avatar";
import LoadingSpinner from "@/components/loader";
import Notes from "@/components/notes";
import { useEffect } from "react";
import { create, fetchAll } from "@/app/actions/notes";
import { useRef } from "react";
import { handleSignOut } from "@/app/login/actions";
import { LogIn } from "lucide-react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { useMount } from "@/context/mount-provider";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Laptop } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const supabase = createClient();
  const [input, setInput] = useState("");
  const { notes, focusingNote } = useNotes();
  const {
    saveNote,
    editNote,
    focusNote,
    unfocusNote,
    deleteNote,
    updateNotes,
  } = useNotes(state => state.actions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const titleFormRef = useRef(null);
  const { mounted } = useMount();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const defaultContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Type here to get started..." }],
      },
    ],
  };

  useEffect(() => {
    const fetchContent = async () => {
      const result = await fetchAll();

      if (result.success) {
        updateNotes(result.data);
      } else {
        setMessage(result.message);
      }
    };

    if (user) {
      fetchContent();
    } else {
      // if there's no user
      updateNotes([]);
    }
  }, [user]); // prev dependency: [user]

  return (
    <div className="w-[20vw] border-r border-[#ddd] dark:border-[#212121] h-full p-2 flex flex-col">
      <form
        ref={titleFormRef}
        action={async (formData) => {
          titleFormRef?.current.reset();
          const supabase_like_date = new Date().toISOString();
          const note = {
            id: nanoid(10),
            title: formData.get("title"),
            content: defaultContent,
            created_at: supabase_like_date,
          };

          saveNote(note);

          if (!user) return;

          const response = await create(formData);
          if (!response.success) {
            deleteNote(note.id);
          } else {
            editNote(note.id, response.data);
          }

        }}

        className="flex flex-col gap-2"
      >
        <input
          autoFocus
          name="title"
          type="text"
          placeholder="Enter a title"
          maxLength={50}
          className="focus:outline-0 h-10 text-center"
          required
        />
        <Button
          variant="outline"
          type="submit"
          className="active:bg-gray-100 hover:bg-gray-50"
        >
          Create
        </Button>
      </form>

      <p className="text-gray-800 dark:text-gray-300 py-2 my-2 border-b border-[#ddd] dark:border-[#333] border-dashed">
        Notes
      </p>

      <Notes />

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-gray-500 dark:outline-blue-500 outline-offset-4 w-full flex gap-2 justify-start items-center h-10 p-1 text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-900 mt-2 border rounded-md shadow-xs">
          <Avatar user={user} />
          <span className="text-text">
            {user ? user.user_metadata.full_name : "username"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          className={"font-inter mb-2 lg:w-[16rem] drop-shadow-xs"}
        >
          <DropdownMenuLabel>
            {user ? user.user_metadata.email : "My Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserIcon />
            Team
          </DropdownMenuItem>
          {user ? (
            <DropdownMenuItem
              onClick={async () => {
                await handleSignOut(); //server
                await supabase.auth.signOut(); //client
              }}
            >
              <LogOutIcon />
              Log out
              {loading && <LoadingSpinner />}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogIn />
              Log in
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-gray-500 dark:text-neutral-400">
            Preferences
          </DropdownMenuLabel>

          <DropdownMenuItem className="flex justify-between items-center">
            <span>Theme</span>
            <div className="flex justify-around items-center gap-1.5 border border-[#ddd] dark:border-[#444] rounded-md px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("system");
                }}
                className={`p-0.5 px-1.5 rounded-full ${theme === "system" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-400"}`}
              >
                <Laptop className="w-4 h-4 text-inherit" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("light");
                }}
                className={`p-0.5 px-1 rounded-full ${theme === "light" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-400"}`}
              >
                <Sun className="w-4 h-4 text-inherit" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("dark");
                }}
                className={`p-0.5 px-1 rounded-full ${theme === "dark" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-400"}`}
              >
                <Moon className="w-4 h-4 text-inherit" />
              </button>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem>Language</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
