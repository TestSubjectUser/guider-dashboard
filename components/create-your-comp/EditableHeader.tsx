import React from "react";

function EditableHeader({
  textValue = "enter text...",
  textColor = "black",
  textSize = "1rem",
  placeholderValue = "enter text...",
  setText,
}: {
  textValue: string;
  textColor: string;
  textSize: string;
  placeholderValue: string;
  setText: (newText: string) => void;
}) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "2px",
        width: "100%",
      }}
    >
      <input
        ref={inputRef}
        type="text"
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
        {isEditing ? "Save" : "Edit"}
      </button>
    </div>
  );
}

export default EditableHeader;
