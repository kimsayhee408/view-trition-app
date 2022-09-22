import { useState, useEffect, useCallback, useRef } from "react";

import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorModal from "./UI/ErrorModal";
import SearchResults from "./SearchResults";

function FdcSearch() {
  const [fdcSearchResults, setFdcSearchResults] = useState([]);
  const [fdcSearchTerm, setFdcSearchTerm] = useState("");
  const fdcSearchInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null); // if a error occurs, this state will attain a value --> in which case we will display <ErrorModal> instead of <SearchResults>

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

    setIsLoading(true);
    fetch(fdc_api_url)
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          "Problem fetching data from  the Food Data Central database. Please try again later."
        );
      })
      .then((responseData) => {
        setFdcSearchResults(responseData.foods);
      })
      .catch((err) => {
        console.log("CATCHING ERROR");
        setLoadingError(err.message);
        setIsLoading(false); // should reset to false even if error!!
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

  const clearError = () => {
    setLoadingError(null);
    setIsLoading(false);
  };

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
      {isLoading ? (
        <LoadingIndicator />
      ) : loadingError ? (
        <ErrorModal onClose={clearError}>{loadingError}</ErrorModal>
      ) : (
        <SearchResults results={fdcSearchResults} />
      )}
    </div>
  );
}

export default FdcSearch;
