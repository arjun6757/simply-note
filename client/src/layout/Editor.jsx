import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import {
  BoldIcon, UnderlineIcon, ItalicIcon,
  Heading2Icon, Heading1Icon, Heading3Icon,
  ListIcon, ListOrderedIcon, QuoteIcon,
  ImageIcon
} from '@/components/icons/Icons.jsx';
import { useState, useEffect } from 'react';
import { useNotes } from '@/store/notes';
import DOMPurify from 'dompurify';
import Link from '@tiptap/extension-link';
import { LinkIcon } from 'lucide-react';
import { useCallback } from 'react';

export default function Editor() {

  const defaultContent = '<p>Type here to get started...</p>';
  const defaultTitle = 'Untitled';

  const { focusingNote, actions } = useNotes();
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const { editNote } = actions;

  const editor = useEditor({
    extensions: [StarterKit, Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: 'https',
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'editor-image'
        }
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const purifiedHTML = DOMPurify.sanitize(editor.getHTML());
      setContent(purifiedHTML);
    },
  });

  if (!editor) {
    return <p>Editor not initialized properly</p>;
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  useEffect(() => {
    if (focusingNote) {
      setTitle(focusingNote.title);

      const sanitizedContent = DOMPurify.sanitize(focusingNote.content);

      setContent(sanitizedContent || defaultContent);
      editor?.commands.setContent(sanitizedContent || defaultContent);

    } else {
      setTitle(defaultTitle);
      setContent(defaultContent);
      editor?.commands.setContent(defaultContent);
    }

  }, [focusingNote]); // Runs only when focusingNote changes


  useEffect(() => {

    if (focusingNote) {
      editNote({ id: focusingNote.id, title, content });
    }

  }, [title, content, focusingNote, editNote])

  const handleLink = () => {
    const prevLink = editor.getAttributes('link').href;   // check if link exists

    if (prevLink) {
      // if it has link just remove it
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt('Enter your url: ');
      const purified = DOMPurify.sanitize(url);
      editor.chain().focus().toggleLink({ href: purified }).run();    // toggleLink => name is misleading it is only for setting and updating
    }

  }

  const handleImage = useCallback(() => {
    const url = window.prompt("Enter image source link: ");

    const sanitizedURL = DOMPurify.sanitize(url);

    if (sanitizedURL) {
      editor.chain().focus().setImage({ src: sanitizedURL }).run()
    }
  }, [editor])

  const handlescroll = (e) => {
    const bar = document.getElementById('button-bar');
    const editor = document.getElementById('editor');
    const exist = document.querySelector('.stickybar-active');

    if (!bar) return;

    if (exist) {
      bar.classList.remove('stickybar-active');
    }

    if (parseInt(editor.scrollTop) > 65) {
      bar.classList.add('stickybar-active');
    }
  }

  return (
    <div id='editor' onScroll={() => handlescroll()} className=' w-full h-full flex-1 border-0 p-4 text-wrap overflow-y-scroll scrollbar-thin'>
      <div className='flex justify-center'>
        <input
          type="text"
          maxLength={50}
          value={title}
          onChange={handleTitleChange}
          className='focus:outline-0 h-10 text-center text-gray-800 font-light text-xl mb-2.5 w-full' />
      </div>
      <div id='button-bar' className="mb-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${editor.isActive("bold") ? "selected" : ""}`}
        >
          <BoldIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "selected" : ""}
        >
          <UnderlineIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "selected" : ""}
        >
          <ItalicIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "selected" : ""}
        >
          <Heading1Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "selected" : ""}
        >
          <Heading2Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "selected" : ""}
        >
          <Heading3Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "selected" : ""}
        >
          <ListIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "selected" : ""}
        >
          <ListOrderedIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "selected" : ""}
        >
          <QuoteIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleImage}
          className={editor.isActive("image") ? "selected" : ""}
        >
          <ImageIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleLink()}
          className={editor.isActive("link") ? "selected" : ""}
        >
          <LinkIcon />
        </Button>
      </div>
      <EditorContent editor={editor} className='text-[16px] font-noto' />
    </div>
  )
}
