import React, { useState } from "react";
import { useSelector } from "react-redux";

import User from "./User";
import "./Users.css";

const UsersList = () => {
  const users = useSelector((state) => state.usersReducer);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20); // Change the number of users per page as needed
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(null);

  // Calculate index of the first and last user on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    // Check if user.name is not null or undefined before calling toLowerCase
    return (
      user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get current users to display on the current page
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Total number of pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
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

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter === filter ? null : selectedFilter);
    setCurrentPage(1);
  };

  const filterTypes = [
    "Reputation",
    "New User",
    "Voters",
    "Editors",
    "Moderators",
  ];

  return (
    <div className="user-list-container">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Filter by user"
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="filters">
        {filterTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={filter === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Render users */}
      <div className="users">
        {currentUsers.map((user) => (
          <User user={user} key={user._id} />
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={goToPreviousPage}>Previous</button>
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
          <button onClick={goToNextPage}>Next</button>
        )}
      </div>
    </div>
  );
};

export default UsersList;
