import { useEditor, EditorContent } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  BoldIcon, UnderlineIcon, ItalicIcon, Heading2Icon, Heading1Icon, Heading3Icon, ListIcon, ListOrderedIcon, QuoteIcon, ImageIcon, LinkIcon1
} from '@/components/icons/Icons.jsx';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotes } from '@/store/notes';
import DOMPurify from 'dompurify';
import { Link, StarterKit, Underline, Image } from '@/utils/extensions';

export default function Editor() {
  const defaultContent = '<p>Type here to get started...</p>';
  const defaultTitle = 'Untitled';
  const buttonBarRef = useRef(null);
  const editorRef = useRef(null);
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
      editor.chain().focus().setImage({ src: sanitizedURL }).run();
    }
  }, [editor])

  const handlescroll = () => {
    // const bar = document.getElementById('button-bar');
    const bar = buttonBarRef.current;
    const editor = editorRef.current;
    const exist = document.querySelector('.stickybar-active');

    if (!bar) return;

    if (exist) {
      bar.classList.remove('stickybar-active');
    }

    if (editor) {
      if (parseInt(editor.scrollTop) > 65) {
        bar.classList.add('stickybar-active');
      }
    }
  }

  // having a shaky effect on sticky bar getting to it's original position if editor is not focused but still getting scrolled

  return (
    <div ref={editorRef} onScroll={() => handlescroll()} className=' w-full h-full flex-1 border-0 p-4 text-wrap overflow-y-scroll scrollbar-thin'>
      <div className='flex justify-center'>
        <input
          type="text"
          maxLength={50}
          value={title}
          onChange={handleTitleChange}
          className='focus:outline-0 h-10 text-center text-gray-800 font-light text-xl mb-2.5 w-full' />
      </div>
      <div ref={buttonBarRef} className="mb-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${editor.isActive("bold") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}`}
        >
          <BoldIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <UnderlineIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <ItalicIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <Heading1Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <Heading2Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <Heading3Icon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <ListIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <ListOrderedIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <QuoteIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleImage}
          className={editor.isActive("image") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <ImageIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleLink()}
          className={editor.isActive("link") ? "selected" : "active:bg-gray-100 hover:bg-gray-50 focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-500"}
        >
          <LinkIcon1 />
        </Button>
      </div>
      <EditorContent editor={editor} className='text-[16px] font-noto' />
    </div>
  )
}
