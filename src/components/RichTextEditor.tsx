import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid,
  Type,
  Code,
  Layout
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, mode, setMode }: { editor: any, mode: 'compose' | 'html', setMode: (m: 'compose' | 'html') => void }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const isHtmlMode = mode === 'html';

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 rounded-t-2xl">
      <div className="flex gap-1 pr-2 border-r border-gray-200 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 mr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={isHtmlMode}
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1">
        <button
          onClick={addLink}
          disabled={isHtmlMode}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'} ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Hyperlink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          disabled={isHtmlMode}
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          disabled={isHtmlMode}
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${isHtmlMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Insert Table"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      <div className="ml-auto flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
        <button
          onClick={() => setMode('compose')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
            mode === 'compose' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Layout className="w-3 h-3" />
          Compose
        </button>
        <button
          onClick={() => setMode('html')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
            mode === 'html' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Code className="w-3 h-3" />
          HTML UI
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = React.useState<'compose' | 'html'>('compose');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gray-900 font-bold underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full border border-gray-200 my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 bg-gray-50 px-4 py-2 font-bold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 px-4 py-2',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-md my-6 max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none prose-p:leading-relaxed prose-headings:font-black focus:outline-none min-h-[400px] p-6 text-gray-900',
      },
    },
  });

  // Update editor content if content prop changes and doesn't match current editor content
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:border-gray-900 transition-all">
      <MenuBar editor={editor} mode={mode} setMode={setMode} />
      
      {mode === 'compose' ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="bg-gray-900 p-0 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[400px] bg-gray-900 text-green-400 font-mono text-sm p-6 outline-none resize-none leading-relaxed selection:bg-white/10"
            spellCheck={false}
          />
        </div>
      )}

      <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4">
         <span>Platform CMS Editor v2.0</span>
         <span>{mode === 'compose' ? 'Visual UI' : 'Source Mode'} Enabled</span>
      </div>
    </div>
  );
}
