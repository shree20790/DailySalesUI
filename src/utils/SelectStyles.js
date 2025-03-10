const SelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#c92f23" : "lightgray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "red",
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#c92f23" : isFocused ? "lightgray" : "white",
      color: isSelected ? "white" : "black",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#c92f23",
        color: "white",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "transparent",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "black",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "black",
      "&:hover": {
        backgroundColor: "lightgray",
        color: "black",
      },
    }),
  };
  
  export default SelectStyles;
  