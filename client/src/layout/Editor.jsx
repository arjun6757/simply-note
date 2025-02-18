import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, List, ListOrdered } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotes } from '@/store/notes';

export default function Editor() {

  const { focusingNote, actions } = useNotes();
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('Type here to get started...');
  const { editNote } = actions;

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  useEffect(() => {
    if (focusingNote) {
      setTitle(focusingNote.title);
      setContent(focusingNote.content || "Type here to get started...");
      editor?.commands.setContent(focusingNote.content || "Type here to get started...");
    } else {
      setTitle("Untitled");
      setContent("Type here to get started...");
      editor?.commands.setContent("Type here to get started...");
    }

  }, [focusingNote]); // Runs only when focusingNote changes
  

  useEffect(() => {

    if (focusingNote) {
      editNote({ id: focusingNote.id, title, content });
    }

  }, [title, content, focusingNote, editNote])

  return (
    <div className='w-full h-full flex-1 border-0 p-4 text-wrap overflow-y-scroll scrollbar-thin'>
      <div className='flex justify-center'>
        <input type="text" maxLength={50} value={title} onChange={handleTitleChange} className='focus:outline-0 h-10 text-center text-gray-900 text-lg sm:text-xl w-full' />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-[#f0f0f0]" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-[#f0f0f0]" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-[#f0f0f0]" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-[#f0f0f0]" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-[#f0f0f0]" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
