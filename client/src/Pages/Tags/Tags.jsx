import React, { useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TagsList from "./TagsList";
import "./Tags.css";
import { tagsList } from "./tagList";

const Tags = ({ slideIn, handleSlideIn }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tagsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Popular");

  // Calculate the index of the first and last tag of the current page
  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;

  // Filter tags based on search query
  const filteredTags = tagsList.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter tags based on filter criteria
  const filteredAndSortedTags = filteredTags.sort((a, b) => {
    if (filter === "Name") {
      return a.tagName.localeCompare(b.tagName);
    } else if (filter === "New") {
      return b.createdAt - a.createdAt;
    } else {
      // Default to sorting by popularity
      return b.popularity - a.popularity;
    }
  });

  // Get current tags to display on the current page
  const currentTags = filteredAndSortedTags.slice(
    indexOfFirstTag,
    indexOfLastTag
  );

  // Total number of pages
  const totalPages = Math.ceil(filteredAndSortedTags.length / tagsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search input change
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Generate array of page numbers to display in pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = currentPage > 5 ? currentPage - 4 : 1;
    let endPage = Math.min(startPage + 9, totalPages);

    if (currentPage > 5) {
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

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(tagsList.length / tagsPerPage))
    );
  };

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <h1 className="tags-h1">Tags</h1>
        <p className="tags-p">
          A tag is a keyword or label that categorizes your question with other,
          similar questions.
        </p>
        <p className="tags-p">
          Using the right tags makes it easier for others to find and answer
          your question.
        </p>
        {/* Search bar */}
        <input
          id="tag-search-bar"
          type="text"
          placeholder="Filter by tag name"
          value={searchQuery}
          onChange={handleSearch}
        />
        {/* Filter buttons */}
        <div className="filter-buttons">
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
          <button
            className={filter === "New" ? "active" : ""}
            onClick={() => handleFilterChange("New")}
          >
            New
          </button>
        </div>
        {/* Tags list */}
        <div className="tags-list-container">
          {currentTags.map((tag, index) => (
            <TagsList tag={tag} key={index} />
          ))}
        </div>
        {/* Pagination */}
        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={goToPreviousPage}>Prev</button>
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
          {currentPage < Math.ceil(tagsList.length / tagsPerPage) && (
            <button onClick={goToNextPage}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;
