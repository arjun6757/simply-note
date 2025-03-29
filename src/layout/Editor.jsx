"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  UnderlineIcon,
  ItalicIcon,
  Heading2Icon,
  Heading1Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  ImageIcon,
  LinkIcon1,
} from "@/components/icons/Icons.jsx";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNotes } from "@/zustand/notes";
import { useAuth } from "@/context/AuthProvider";
import { Link, StarterKit, Underline, Image } from "@/utils/extensions";
import { update } from "@/app/actions/notes";
import lodash from "lodash";
import { toast, Toaster } from "sonner";
import { Check, Code, XIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import LoadingSpinner from "@/components/loader";

export default function Editor() {
  const defaultContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Type here to get started..." }],
      },
    ],
  };

  const defaultTitle = "Untitled";
  const buttonBarRef = useRef(null);
  const editorRef = useRef(null);
  const { focusingNote, actions } = useNotes();
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const { editNote } = actions;
  const prevContent = useRef({ title: "", content: "" });
  const { user } = useAuth();
  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
    ],

    content: content,

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      const jsonData = editor.getJSON();
      setContent(jsonData);
    },
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    if (focusingNote) {
      setTitle(focusingNote.title);
      setContent(focusingNote.content);
      editor?.commands.setContent(focusingNote.content);
    } else {
      setTitle(defaultTitle);
      setContent(defaultContent);
      editor?.commands.setContent(defaultContent);
    }

    // reset prevContent on change
    prevContent.current = { title: "", content: "" };
  }, [focusingNote]); // Runs only when focusingNote changes

  useEffect(() => {
    if (user) return;
    setTitle(defaultTitle);
    setContent(defaultContent);
    editor?.commands.setContent(defaultContent);
  }, [user]);

  useEffect(() => {
    // TODO: think do i even need this line ? i mean yeah but think a bit more
    if (!focusingNote) return;

    if (lodash.isEqual(prevContent.current, { title, content })) return; // prevent unnecessary calls

    // i want the client update to be instant only want the title TODO: separate content and title
    editNote(focusingNote.id, {
      ...focusingNote,
      title,
      content,
    });

    // only go to db call if user exist
    if (!user) return;

    // TODO: need separation logic for all notes while updating for more snappy experience

    // sent json because of image attr showing as an anonymous function
    const data = JSON.stringify(content);

    const timeoutId = setTimeout(async () => {
      const toastId = toast(
        <div className="flex gap-4 font-inter items-center">
          <div className="flex items-center">
            <LoadingSpinner className={"text-gray-700 dark:text-gray-300"} />
          </div>
          <div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Syncing data
            </span>
            <p className="text-xs text-neutral-500">
              Changes are getting saved automatically
            </p>
          </div>
        </div>,
        {
          className: "bg-white dark:bg-black",
          duration: Infinity,
        },
      );

      const response = await update({
        ...focusingNote,
        title,
        content: data,
      });

      toast.dismiss(toastId);

      if (response.success) {
        toast(
          <div className="flex gap-4 font-inter">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Success
              </span>
              <p className="text-xs text-neutral-500">
                Changes saved successfully!
              </p>
            </div>
          </div>,
        );
      } else {
        toast(
          <div className="flex gap-4 items-center font-inter">
            <div className="flex items-center">
              <XIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <span className="text-red-500 text-sm">Error</span>
              <p className="text-xs text-red-400">{response.message}</p>
            </div>
          </div>,
        );
      }

      prevContent.current = { title, content };
    }, 5000); // 5s for now

    return () => clearTimeout(timeoutId); // clear timeout on re-renders
  }, [title, content, focusingNote, editNote]);

  const handleLink = () => {
    const prevLink = editor.getAttributes("link").href; // check if link exists

    if (prevLink) {
      // if it has link just remove it
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("Enter your url: ");
      if (!url) return;
      const valid = new URL(url);

      if (!valid) {
        return alert("URL is not a valid");
      }

      editor.chain().focus().toggleLink({ href: valid.href }).run(); // toggleLink => name is misleading it is only for setting and updating
    }
  };

  const handleImage = useCallback(() => {
    const url = window.prompt("Enter image source link: ");
    if (!url) return;

    const valid = new URL(url);

    if (valid) {
      editor.chain().focus().setImage({ src: valid.href }).run();
    }
  }, [editor]);

  // TODO: having a shaky effect on sticky bar getting to it's original position if editor is not focused but still getting scrolled (fixed 🤗)

  const handleScroll = () => {
    if (!buttonBarRef.current || !editorRef.current) return;

    requestAnimationFrame(() => {
      const bar = buttonBarRef.current;
      const editor = editorRef.current;

      const shouldActivate = editor.scrollTop > 65;
      const classExist = bar.classList.contains("stickybar-active");

      if (shouldActivate && !classExist) {
        bar.classList.add("stickybar-active");
      } else if (!shouldActivate && classExist) {
        bar.classList.remove("stickybar-active");
      }
    });
  };

  return (
    <div
      ref={editorRef}
      onScroll={handleScroll}
      className="w-full h-full flex-1 border-0 p-4 text-wrap overflow-y-scroll scrollbar-thin"
    >
      <Toaster theme={theme} />

      <div className="flex justify-center">
        <input
          type="text"
          maxLength={50}
          value={title}
          onChange={handleTitleChange}
          className="focus:outline-0 h-10 text-center text-gray-800 dark:text-gray-200 font-light text-xl mb-2.5 w-full"
        />
      </div>
      <div ref={buttonBarRef} className="mb-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`${editor?.isActive("bold") ? "selected" : "active:bg-gray-100 hover:bg-gray-50"}`}
        >
          <BoldIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={
            editor?.isActive("underline")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <UnderlineIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={
            editor?.isActive("italic")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <ItalicIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor?.isActive("heading", { level: 1 })
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <Heading1Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor?.isActive("heading", { level: 2 })
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <Heading2Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor?.isActive("heading", { level: 3 })
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <Heading3Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={
            editor?.isActive("bulletList")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <ListIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={
            editor?.isActive("orderedList")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <ListOrderedIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={
            editor?.isActive("blockquote")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <QuoteIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="active:bg-gray-100 hover:bg-gray-50"
        >
          {"---"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleImage}
          className={
            editor?.isActive("image")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <ImageIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleLink()}
          className={
            editor?.isActive("link")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <LinkIcon1 />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={
            editor?.isActive("codeBlock")
              ? "selected"
              : "active:bg-gray-100 hover:bg-gray-50"
          }
        >
          <Code />
        </Button>
      </div>
      <EditorContent editor={editor} className="text-[16px] font-sans" />
    </div>
  );
}
