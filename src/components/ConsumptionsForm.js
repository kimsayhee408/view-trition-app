import React from "react";

function ConsumptionsForm(props) {
  return (
    <div>
      <span>
        Servings consumed:
        <input
          type="number"
          onChange={(event) => props.onServingsChange(event.target.value)}
        />
        <button type="button">Add to Diary</button>
      </span>
    </div>
  );
}

export default ConsumptionsForm;
