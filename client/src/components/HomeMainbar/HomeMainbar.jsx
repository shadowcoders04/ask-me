import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./HomeMainbar.css";
import QuestionList from "./QuestionList";

const HomeMainbar = () => {
  const location = useLocation();
  const user = 1;
  const navigate = useNavigate();

  const questionsList = useSelector((state) => state.questionsReducer);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("New"); // Default filter is "New"
  const [noResults, setNoResults] = useState(false); // State to track if no results found

  const filteredQuestions = questionsList.data
    ? questionsList.data.filter((question) => {
        // Filter based on search query matching question title or tags
        return (
          question.questionTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          question.questionTags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      })
    : [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setNoResults(false); // Reset noResults state when search query changes
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const checkAuth = () => {
    if (user === null) {
      alert("login or signup to ask a question");
      navigate("/Auth");
    } else {
      navigate("/AskQuestion");
    }
  };

  // const askOwnQuestion = () => {
  //   navigate("/AskQuestion");
  // };

  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Questions</h1>
        ) : (
          <h1>All Questions</h1>
        )}
        <button onClick={checkAuth} className="ask-btn">
          Ask Question
        </button>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="filter-options">
        <button
          className={filter === "New" ? "active" : ""}
          onClick={() => handleFilterChange("New")}
        >
          New
        </button>
        <button
          className={filter === "Old" ? "active" : ""}
          onClick={() => handleFilterChange("Old")}
        >
          Old
        </button>
        <button
          className={filter === "Popular" ? "active" : ""}
          onClick={() => handleFilterChange("Popular")}
        >
          Popular
        </button>
        <button
          className={filter === "Name" ? "active" : ""}
          onClick={() => handleFilterChange("Name")}
        >
          Name
        </button>
      </div>
      <div>
        {questionsList.data === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {filteredQuestions.length === 0 && searchQuery && (
              <div className="no-results">
                <h1>404 Error!</h1>
                <p>No results found. please Ask your own question!</p>
              </div>
            )}
            {filteredQuestions.length > 0 && (
              <>
                <p>{filteredQuestions.length} questions</p>
                <QuestionList
                  questionsList={filteredQuestions}
                  filter={filter}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeMainbar;
