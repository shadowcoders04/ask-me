// QuestionList.jsx

import React, { useState } from "react";
import Questions from "./Questions";
import "./HomeMainbar.css";

const QuestionList = ({ questionsList, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10); // Initial value set to 10
  const maxPageNumbers = 5; // Maximum number of page numbers to display in pagination

  // Sort questions based on the selected filter
  const sortedQuestions = [...questionsList].sort((a, b) => {
    if (filter === "New") {
      return new Date(b.askedOn) - new Date(a.askedOn);
    } else if (filter === "Old") {
      return new Date(a.askedOn) - new Date(b.askedOn);
    } else if (filter === "Popular") {
      return (b.upVote.length - b.downVote.length) - (a.upVote.length - a.downVote.length);
    } else if (filter === "Name") {
      return a.userPosted.localeCompare(b.userPosted);
    }
  });

  // Calculate the index of the first and last question of the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = sortedQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const handlePerPageChange = (perPage) => {
    setQuestionsPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing questions per page
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage =
      currentPage > Math.floor(maxPageNumbers / 2)
        ? currentPage - Math.floor(maxPageNumbers / 2)
        : 1;
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    if (currentPage > Math.floor(maxPageNumbers / 2) + 1) {
      pageNumbers.push(1, "...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push("...", totalPages);
    }

    return pageNumbers;
  };

  return (
    <>
      {currentQuestions.map((question) => (
        <Questions question={question} key={question._id} />
      ))}
      <div className="page-per-container">
        <label>per page:</label>
        <div className="per-page-options">
          <button
            className={questionsPerPage === 10 ? "active" : ""}
            onClick={() => handlePerPageChange(10)}
          >
            10
          </button>
          <button
            className={questionsPerPage === 15 ? "active" : ""}
            onClick={() => handlePerPageChange(15)}
          >
            15
          </button>
          <button
            className={questionsPerPage === 20 ? "active" : ""}
            onClick={() => handlePerPageChange(20)}
          >
            20
          </button>
        </div>
      </div>
      <div className="pagination-container">
        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={prevPage}>Prev</button>
          )}
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => paginate(pageNumber)}
              className={currentPage === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}
          {currentPage < totalPages && (
            <button onClick={nextPage}>Next</button>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionList;
