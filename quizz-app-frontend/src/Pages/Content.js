import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./styles/Content.css";

const Content = () => {
  const [selectedTag, setSelectedTag] = useState("ВСЕ");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [quizzesCache, setQuizzesCache] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const quizzesPerPage = 4;

  useEffect(() => {
    fetch("http://localhost:8000/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(["ВСЕ", ...data.map((t) => t.name)]);
      });
  }, []);

  useEffect(() => {
    const cacheKey = `${selectedTag}-${searchQuery}-${currentPage}`;
    if (quizzesCache[cacheKey]) {
      setQuizzes(quizzesCache[cacheKey].quizzes);
      setTotalPages(quizzesCache[cacheKey].totalPages);
      return;
    }

    const tagParam = selectedTag !== "ВСЕ" ? `&tag=${selectedTag}` : "";
    const searchParam = searchQuery ? `&search=${searchQuery}` : "";

    fetch(
      `http://localhost:8000/quizzes?page=${currentPage + 1}&limit=${quizzesPerPage}${tagParam}${searchParam}`
    )
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data.quizzes);
        const pages = Math.ceil(data.total / quizzesPerPage);
        setTotalPages(pages);
        setQuizzesCache((prev) => ({
          ...prev,
          [cacheKey]: {
            quizzes: data.quizzes,
            totalPages: pages,
          },
        }));
      });
  }, [selectedTag, searchQuery, currentPage]);

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setCurrentPage(0);
    setSearchQuery("");
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(0);
  };

  return (
    <div className="content-container">
      <h1 className="content-title">Welcome to <span>QuizMeUp</span></h1>
      <p className="content-subtitle">Your all-in-one tool for <strong>winning</strong> and <strong>learning</strong> 🎯</p>

      <div className="content-controls">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="content-input"
        />
        <button onClick={handleSearch} className="content-button">
          Search
        </button>

        <select
          value={selectedTag}
          onChange={handleTagChange}
          className="content-select"
        >
          {tags.map((tag, i) => (
            <option key={i} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <ul className="quiz-list">
     {quizzes.map((quiz) => (
      <li
      key={quiz.id}
      onClick={() => handleQuizClick(quiz.id)}
      className="quiz-item"
      >
      <h3 className="quiz-title">{quiz.title}</h3>
      <p className="quiz-description">{quiz.description || 'No description provided.'}</p>
      </li>
     ))}
    </ul>

      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={currentPage === 0 ? null : "←"}
          nextLabel={currentPage === totalPages - 1 ? null : "→"}
          breakLabel={"..."}
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
};

export default Content;
