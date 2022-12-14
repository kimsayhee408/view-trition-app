import React from "react";
import { useState } from "react";
import ConsumptionsForm from "./ConsumptionsForm";

function ClickedItemDetails(props) {
  const [consumedGramWeight, setConsumedGramWeight] = useState(100);
  const [enteredServingAmount, setEnteredServingAmount] = useState(1);
  const { item } = props;

  const multiplier = (consumedGramWeight / 100) * enteredServingAmount;
  console.log("multiplier", multiplier); // a constant simply derived from the two states; doesn't need to be a state

  const itemHeaderContent = (
    <>
      <h2>{item.description || ""}</h2>
      <p>{item.foodCategory || ""}</p>
    </>
  );

  const defaultServingOption = <option value="100">100g</option>;

  const servingOptions = item.foodMeasures ?? []; // some results from FDC do not have common foodMeasures
  const servingSelectElement = servingOptions.length ? (
    <select
      onChange={(event) => {
        console.log(event.target.value);
        console.log(typeof event.target.value);
        setConsumedGramWeight(Number(event.target.value));
      }}
    >
      {defaultServingOption}
      {servingOptions.map((servObj) => (
        <option
          key={servObj.id}
          value={servObj.gramWeight}
        >{`${servObj.disseminationText} (${servObj.gramWeight}g)`}</option>
      ))}
    </select>
  ) : (
    defaultServingOption
  );

  const generateNutrientRowElement = (name, id) => {
    return (
      <tr>
        <td>{name}</td>
        <td>
          {item.foodNutrients?.filter(
            (nutrientObj) => nutrientObj.nutrientId === id
          )[0]?.value
            ? (
                item.foodNutrients?.filter(
                  (nutrientObj) => nutrientObj.nutrientId === id
                )[0]?.value * multiplier
              ).toFixed(2)
            : "-"}
          {/* using ?? instead of || because when a the nutrient amount is 0, we want to render 0 vs a dash*/}
        </td>
        <td>
          {item.foodNutrients?.filter(
            (nutrientObj) => nutrientObj.nutrientId === id
          )[0]?.unitName ?? "-"}
        </td>
      </tr>
    );
  };

  const handleServingAmountChange = (servingsInput) => {
    console.log(`I ATE ${servingsInput} SERVINGS`);
    setEnteredServingAmount(Number(servingsInput));
  };

  const carbohydratesTable = (
    <table>
      <caption>CARBOHYDRATES</caption>
      <tbody>
        {generateNutrientRowElement(`Carbs`)}
        {generateNutrientRowElement(` Fiber`, 1079)}
        {generateNutrientRowElement(` Starch`)}
        {generateNutrientRowElement(` Sugars`, 2000)}
        {generateNutrientRowElement(` Added Sugars`)}
        {generateNutrientRowElement(` Net Carbs`)}
      </tbody>
    </table>
  );

  const lipidsTable = (
    <table>
      <caption>LIPIDS</caption>
      <tbody>
        {generateNutrientRowElement(`Fat`, 1004)}
        {generateNutrientRowElement(` Monounsaturated`, 1292)}
        {generateNutrientRowElement(` Polyunsaturated`, 1293)}
        {generateNutrientRowElement(`   Omega-3`)}
        {generateNutrientRowElement(`   Omega-6`)}
        {generateNutrientRowElement(` Saturated`, 1258)}
        {generateNutrientRowElement(` Trans-Fats`)}
        {generateNutrientRowElement(`Cholesterol`, 1253)}
      </tbody>
    </table>
  );

  const proteinTable = (
    <table>
      <caption>PROTEIN</caption>
      <tbody>
        {generateNutrientRowElement(`Protein`, 1079)}
        {generateNutrientRowElement(` Cystine`, 1216)}
        {generateNutrientRowElement(` Histidine`, 1221)}
        {generateNutrientRowElement(` Isoleucine`, 1212)}
        {generateNutrientRowElement(` Leucine`, 1213)}
        {generateNutrientRowElement(` Lysine`, 1214)}
        {generateNutrientRowElement(` Methionine`, 1215)}
        {generateNutrientRowElement(` Phenylalanine`, 1217)}
        {generateNutrientRowElement(` Threonine`, 1211)}
        {generateNutrientRowElement(` Tryptophan`, 1210)}
        {generateNutrientRowElement(` Tyrosine`, 1218)}
        {generateNutrientRowElement(` Valine`, 1219)}
      </tbody>
    </table>
  );

  const vitaminsTable = (
    <table>
      <caption>VITAMINS</caption>
      <tbody>
        {generateNutrientRowElement(`B1 (Thiamine)`, 1165)}
        {generateNutrientRowElement(`B2 (Riboflavin)`, 1166)}
        {generateNutrientRowElement(`B3 (Niacin)`, 1167)}
        {generateNutrientRowElement(`B5 (Panthothenic Acid)`, 1170)}
        {generateNutrientRowElement(`B6 (Pyriodoxine),`, 1175)}
        {generateNutrientRowElement(`B12 (Cobalamin)`, 1178)}
        {generateNutrientRowElement(`Folate`, 1177)}
        {generateNutrientRowElement(`Vitamin A`, 1106)}
        {generateNutrientRowElement(`Vitamin C`, 1162)}
        {generateNutrientRowElement(`Vitamin D`, 1114)}
        {generateNutrientRowElement(`Vitamin E`, 1109)}
        {generateNutrientRowElement(`Vitamin K`, 1185)}
      </tbody>
    </table>
  );
  const mineralsTable = (
    <table>
      <caption>MINERALS</caption>
      <tbody>
        {generateNutrientRowElement(`Calcium`)}
        {generateNutrientRowElement(`Copper`)}
        {generateNutrientRowElement(`Iron`)}
        {generateNutrientRowElement(`Magnesium`)}
        {generateNutrientRowElement(`Manganese`)}
        {generateNutrientRowElement(`Phosphorus`)}
        {generateNutrientRowElement(`Potassium`)}
        {generateNutrientRowElement(`Selenium`)}
        {generateNutrientRowElement(`Sodium`)}
        {generateNutrientRowElement(`Zinc`)}
      </tbody>
    </table>
  );

  const nutrientsContent = (
    <table>
      <thead>
        <tr>
          <th>NutrientName</th>
          <th>Value</th>
          <th>nutrientId</th>
        </tr>
      </thead>
      <tbody>
        {item.foodNutrients?.map(
          // will error out without optional chaining operator here; ERROR is "Cannot read properties of undefined (reading 'map')""
          (nutrientObj) => (
            <tr key={nutrientObj.foodNutrientId || ""}>
              <td>{nutrientObj.nutrientName || ""}</td>
              <td>{nutrientObj.value || ""}</td>
              <td>{nutrientObj.nutrientId || ""}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      {itemHeaderContent}
      {servingSelectElement}
      <ConsumptionsForm
        onServingAmountChange={handleServingAmountChange}
        servingOptions={servingOptions}
      />
      {carbohydratesTable}
      {lipidsTable}
      {proteinTable}
      {vitaminsTable}
      {mineralsTable}
      {nutrientsContent}
    </div>
  );
}

export default ClickedItemDetails;
