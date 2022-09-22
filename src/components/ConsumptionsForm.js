import React from "react";

function ConsumptionsForm(props) {
  return (
    <div>
      <span>
        Servings consumed:
        <input
          type="number"
          onChange={(event) => props.onServingAmountChange(event.target.value)}
        />
        <button type="button">Add to Diary</button>
      </span>
    </div>
  );
}

export default ConsumptionsForm;
