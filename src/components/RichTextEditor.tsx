import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  // Custom Blot for iframes
  const Quill = ReactQuill.Quill;
  const BlockEmbed = Quill.import('blots/block/embed');

  class IframeBlot extends BlockEmbed {
    static create(value: string) {
      const node = super.create();
      node.setAttribute('src', value);
      node.setAttribute('frameborder', '0');
      node.setAttribute('allowfullscreen', true);
      return node;
    }

    static value(node: HTMLElement) {
      return node.getAttribute('src');
    }
  }
  IframeBlot.blotName = 'iframe';
  IframeBlot.tagName = 'iframe';

  Quill.register(IframeBlot);

  // Configuration for the Quill editor toolbar
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['code-block'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
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
    'video',
    'code-block',
    'iframe',
  ];

  // Custom image handler to support image uploads
  function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          // Replace this with your actual image upload API endpoint
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            const quill = (ReactQuill as any).getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', result.imageUrl);
          } else {
            console.error('Image upload failed');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className="bg-base-100 rounded-box shadow-lg"
    />
  );
};

export default RichTextEditor;
