import React from "react";
import { useState } from "react";
import ClickedItemDetails from "./ClickedItemDetails";
import Card from "./UI/Card";

function SearchResultRow(props) {
  const rowClickHandler = (event) => {
    const identifier = event.currentTarget.id; // Using currentTarget (vs target) bc we want to get id from the <tr>, not the <td>
    props.onSearchRowClick(identifier);
    // console.log(identifier);
  };

  return (
    <tr id={props.food.fdcId} onClick={rowClickHandler}>
      <td>{props.food.description || ""}</td>
      <td>{props.food.dataType || ""}</td>
      <td>{props.food.fdcId || ""}</td>
    </tr>
  );
}

function SearchResults(props) {
  const [clickedItem, setClickedItem] = useState(); // clicked item id, and whether item was clicked

  const onSearchRowClick = (clickedFoodId) => {
    console.log(typeof clickedFoodId, clickedFoodId);
    const matchingFoodInFdcSearchResults = props.results.filter(
      (food) => food.fdcId === Number(clickedFoodId) // fdcId value is a NUMBER; clickedFoodId is a STRING
    );
    console.log(matchingFoodInFdcSearchResults[0]);
    setClickedItem(matchingFoodInFdcSearchResults[0]);
  };

  return (
    <>
      <Card>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Data type</th>
              <th>FDC ID</th>
            </tr>
          </thead>
          <tbody>
            {props.results?.map((food) => {
              // NEED QUESTION MARK HERE otherwise if fetching error does occur, will crash app
              //
              return (
                <SearchResultRow
                  onSearchRowClick={onSearchRowClick}
                  key={food.fdcId}
                  food={food}
                />
              );
            })}
          </tbody>
        </table>
      </Card>
      {clickedItem && (
        <Card>
          <ClickedItemDetails item={clickedItem} />
        </Card>
      )}
    </>
  );
}

export default SearchResults;
