import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

/**
 * RichTextEditor component
 * Provides a rich text editing interface using ReactQuill
 *
 * @param {RichTextEditorProps} props - The props for the RichTextEditor component
 * @returns {React.FC} A React functional component
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  // Configuration for the Quill editor toolbar
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // Allowed formats for the Quill editor
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className="bg-base-100 rounded-box shadow-lg" // Updated to use daisyUI classes
    />
  );
};

export default RichTextEditor;
