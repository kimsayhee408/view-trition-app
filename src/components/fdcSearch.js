import { useState, useEffect, useCallback, useRef } from "react";
import ClickedItemDetails from "./ClickedItemDetails";

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

function FdcSearch() {
  const [fdcSearchResults, setFdcSearchResults] = useState([]);
  const [fdcSearchTerm, setFdcSearchTerm] = useState("");
  const fdcSearchInputRef = useRef();
  const [clickedItem, setClickedItem] = useState({});

  const fetchFdcSearchResults = useCallback((query) => {
    if (query.trim().length < 2) {
      return;
    }

    const emptyParams = {
      api_key: "EoFBpb8jYKfWqwOyZiVGXaFdQMydLUQ6ztjF9qDL",
      dataType: ["SR Legacy", "Survey (FNDDS)", "Branded"],
      sortBy: "dataType.keyword",
      pageSize: 20,
    };

    // create searchParams by adding search term
    const searchParams = { ...emptyParams, query: query };

    // create URL
    const fdc_api_url = `https://api.nal.usda.gov/fdc/v1/search?api_key=${encodeURIComponent(
      searchParams.api_key
    )}&query=${encodeURIComponent(
      searchParams.query
    )}&pageSize=${encodeURIComponent(searchParams.pageSize)}
        &dataType=${encodeURIComponent(searchParams.dataType)}
        $sortBy=${encodeURIComponent(searchParams.sortBy)}
      `;

    console.log("FETCHING");

    fetch(fdc_api_url)
      .then((response) => response.json())
      .then((responseData) => {
        setFdcSearchResults(responseData.foods);
        // const formattedResults = data.foods.map((food) => {
        //   return {
        //     fdcId: food.fdcId || "",
        //     description: food.description || "",
        //     dataType: food.dataType || "",
        //   };
        // });

        // setFdcSearchResults(formattedResults);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //////////////

  useEffect(() => {
    fetchFdcSearchResults(fdcSearchTerm);
  }, [fdcSearchTerm, fetchFdcSearchResults]);

  const searchInputChangeHandler = (event) => {
    console.log("SEARCH CHANGE", event.target.value);
    setFdcSearchTerm(event.target.value);
  };

  const searchButtonClickHandler = () => {
    console.log("CLICKED");
    fetchFdcSearchResults(fdcSearchInputRef.current.value); // clicking search button also works; uses ref to read value
  };

  const onSearchRowClick = (clickedFoodId) => {
    console.log(typeof clickedFoodId, clickedFoodId);
    const matchingFoodInFdcSearchResults = fdcSearchResults.filter(
      (food) => food.fdcId === Number(clickedFoodId) // fdcId value is a NUMBER; clickedFoodId is a STRING
    );
    console.log(matchingFoodInFdcSearchResults[0]);
    setClickedItem(matchingFoodInFdcSearchResults[0]);
  };

  let displayContent;

  const searchResultsTable = (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Data type</th>
          <th>FDC ID</th>
        </tr>
      </thead>
      <tbody>
        {fdcSearchResults.map((food) => {
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
  );

  if (fdcSearchTerm.trim() === "") {
    displayContent = <p>Please enter a search.</p>;
  } else if (fdcSearchResults.length === 0) {
    displayContent = <p>No matching foods found. Please try another search.</p>;
  } else {
    displayContent = searchResultsTable;
  }

  return (
    <div>
      <input
        ref={fdcSearchInputRef}
        value={fdcSearchTerm} // have to 2-way bind to get clearing input field to show "please enter a search" instead of empty search results
        type="text"
        onChange={searchInputChangeHandler}
        placeholder="Search a food."
      ></input>
      <button onClick={searchButtonClickHandler} type="button">
        Search
      </button>
      {displayContent}
      <ClickedItemDetails item={clickedItem} />
    </div>
  );
}

export default FdcSearch;
