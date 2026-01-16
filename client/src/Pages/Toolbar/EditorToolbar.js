import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditorToolbar.css";

const EditorToolbar = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [
        { header: "1" },
        { header: "2" },
      ],
      [{ bold: "bold" }, { italic: "italic" }],
      [{ background: ["yellow", "red", "pink"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block", "link", "image"],
    ],
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "background",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="editor-container">
      <ReactQuill
        style={{ height: "300px" }}
        className="editor"
        placeholder="Write Your Answer Here..."
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default EditorToolbar;
