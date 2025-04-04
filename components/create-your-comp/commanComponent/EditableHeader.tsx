import React, { useState } from "react";
import { HeaderProps } from "../utils/types";

function EditableHeader({
  textValue = "enter text...",
  textColor = "black",
  textSize = "1rem",
  placeholderValue = "enter text...",
  setText,
}: HeaderProps) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [text2, setText2] = useState({
    name: "",
    description: "",
  });

  React.useEffect(() => {
    setText(textValue);
  }, [textValue]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    inputRef.current?.blur();
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setText2((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        // justifyContent: "space-between",
        margin: "2px",
        // maxWidth: "50%",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        name="title"
        style={{
          textDecoration: "none",
          background: "transparent",
          outline: "none",
          border: "none",
          color: textColor,
          fontSize: textSize,
          fontWeight: "bold",
          width: "100%",
          borderBottom: isEditing ? "2px solid #f56565" : "none",
        }}
        value={textValue}
        placeholder={placeholderValue}
        // onChange={onTitleChange}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          // 200 >, to work
          setTimeout(() => setIsEditing(false), 200);
        }}
        readOnly={!isEditing}
      />
      <button
        style={{
          background: "transparent",
          textDecoration: "none",
          border: "none",
          color: "gray",
          cursor: "pointer",
        }}
        onClick={isEditing ? handleSaveClick : handleEditClick}
      >
        {isEditing ? (
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios-filled/50/00A4BD/save--v1.png"
            alt="save--v1"
          />
        ) : (
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/deco-glyph/48/00A4BD/pencil.png"
            alt="pencil"
          />
        )}
      </button>
    </div>
  );
}

export default EditableHeader;
