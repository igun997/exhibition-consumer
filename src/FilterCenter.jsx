import React from "react";

const FilterCenter = ({ onChange, value }) => {
  const letters = [
    "0",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [selectedLetter, setSelectedLetter] = React.useState(value ?? "All");
  return (
    <div className="row">
      <button
        className={`btn btn-sm btn-link ${
          selectedLetter === "All" ? "active" : ""
        }`}
        style={{ padding: "0.1rem" }}
        onClick={() => {
          setSelectedLetter("All");
          onChange("All");
        }}
      >
        All
      </button>
      {letters.map((letter) => (
        <button
          key={letter}
          style={{ padding: "0.1rem" }}
          className={`btn btn-sm btn-link ${
            selectedLetter === letter ? "active" : ""
          }`}
          onClick={() => {
            setSelectedLetter(letter);
            onChange(letter);
          }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default FilterCenter;
