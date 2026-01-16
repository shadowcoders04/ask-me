import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import copy from "copy-to-clipboard";

import upvote from "../../assets/sort-up.svg";
import downvote from "../../assets/sort-down.svg";
import "./Questions.css";
import Avatar from "../../components/Avatar/Avatar";
import DisplayAnswer from "./DisplayAnswer";

import {
  postAnswer,
  deleteQuestion,
  voteQuestion,
} from "../../actions/question";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EditorToolbar from "../Toolbar/EditorToolbar";

import DOMPurify from "dompurify";

const QuestionsDetails = () => {
  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
  };

  const { id } = useParams();
  const questionsList = useSelector((state) => state.questionsReducer);

  // const [Answer, setAnswer] = useState("");
  const [isPreview, setIsPreview] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  // const [editorValue, setEditorValue] = useState("");

  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const location = useLocation();
  const url = "http://localhost:3000";

  const user = 1;
  const checkAuth = () => {
    if (user === null) {
      alert("login or signup to ask a question");
      Navigate("/Auth");
    } else {
      Navigate("/AskQuestion");
    }
  };

  useEffect(() => {
    // Sanitize the editorHtml content using DOMPurify
    const sanitizedHtml = DOMPurify.sanitize(editorHtml);

    // Update the previewHtml state with the sanitized content
    setPreviewHtml(sanitizedHtml);
  }, [editorHtml]);

  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      toast.error("Login or Sign up to Answer a Question");
      setTimeout(() => {
        Navigate("/Auth");
      }, 4000);
    } else {
      if (editorHtml === "") {
        toast.error("Enter an Answer Before Submitting");
      } else {
        const sanitizedHtml = sanitizeHtml(editorHtml);
        dispatch(
          postAnswer({
            id,
            noOfAnswers: answerLength + 1,
            answerBody: sanitizedHtml,
            userAnswered: User.result.name,
          })
        );
        setEditorHtml("");
      }
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    toast.success("URL Copied Successfully");
  };

  const handleDelete = () => {
    toast.success("Question Deleted Successfully..");
    setTimeout(() => {
      dispatch(deleteQuestion(id, Navigate));
    }, 2000);
  };

  const handleUpVote = () => {
    if (User === null) {
      toast.error("Login or Signup to up vote a Question!");
      setTimeout(() => {
        Navigate("/Auth");
      }, 3000);
    } else {
      dispatch(voteQuestion(id, "upVote"));
    }
  };

  const handleDownVote = () => {
    if (User === null) {
      toast.error("Login or Signup to down vote a Question!");
      setTimeout(() => {
        Navigate("/Auth");
      }, 3000);
    } else {
      dispatch(voteQuestion(id, "downVote"));
    }
  };

  // const handleLinkClick = (e) => {
  //   const isLink = e.target.tagName === "A";
  //   const hasTargetBlank =
  //     isLink && e.target.getAttribute("target") === "_blank";

  //   if (isLink && !hasTargetBlank) {
  //     e.preventDefault();
  //     window.open(e.target.href, "_blank");
  //   }

    // Access the document of the iframe and customize link styles
  //   const quillEditor = document.querySelector(".ql-editor");
  //   if (quillEditor) {
  //     const links = quillEditor.querySelectorAll("a");
  //     links.forEach((link) => {
  //       link.style.color = "black";
  //       link.style.fontFamily = "monospace";
  //       link.style.fontSize = "12px";
  //       link.style.textDecoration = "none";
  //       link.style.backgroundColor = "#cccccc";
  //       link.style.padding = "5px";
  //       link.style.borderRadius = "2px";
  //     });
  //   }
  // };

  // const handleEditorChange = (value) => {
  //   setEditorValue(value);
  // };

  return (
    <div className="question-details-page">
      <button onClick={checkAuth} className="ask-btn">
        Ask Question
      </button>
      {questionsList.data === null ? (
        <>
          {toast.pending("Loading")}
          {setTimeout(() => {}, 1000)}(<h1>Loading...</h1>)
        </>
      ) : (
        <>
          <ToastContainer
            position="top-center"
            limit={3}
            closeButton={false}
            theme="colored"
          />
          {questionsList.data
            .filter((question) => question._id === id)
            .map((question) => (
              <div key={question._id}>
                <section className="question-details-container">
                  <h1>{question.questionTitle}</h1>
                  <div className="question-details-container-2">
                    <div className="question-votes">
                      <img
                        src={upvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleUpVote}
                      />
                      <p>{question.upVote.length - question.downVote.length}</p>
                      <img
                        src={downvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleDownVote}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <p className="question-body">{question.questionBody}</p>
                      <div className="question-details-tags">
                        {question.questionTags.map((tag) => (
                          <p key={tag}>{tag}</p>
                        ))}
                      </div>
                      <div className="question-actions-user">
                        <div>
                          <button type="button" onClick={handleShare}>
                            Share
                          </button>
                          {User?.result?._id === question?.userId && (
                            <button type="button" onClick={handleDelete}>
                              Delete
                            </button>
                          )}
                        </div>
                        <div>
                          <p>asked {moment(question.askedOn).fromNow()}</p>
                          <Link
                            to={`/Users/${question.userId}`}
                            className="user-link"
                            style={{ color: "#0086d8" }}
                          >
                            <Avatar
                              backgroundColor="orange"
                              px="8px"
                              py="5px"
                              borderRadius="4px"
                            >
                              {question.userPosted.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>{question.userPosted}</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {question.noOfAnswers !== 0 && (
                  <section>
                    <h3>{question.noOfAnswers} Answers</h3>
                    <DisplayAnswer
                      key={question._id}
                      question={question}
                      handleShare={handleShare}
                    />
                  </section>
                )}
                <section className="post-ans-container">
                  <h3>Your Answer</h3>
                  <form
                    onSubmit={(e) => {
                      handlePostAns(e, question.answer.length);
                    }}
                  >
                    {isPreview ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(editorHtml),
                        }}
                      />
                    ) : (
                      <EditorToolbar
                        theme="snow"
                        value={editorHtml}
                        onChange={(value) => setEditorHtml(value)}
                        // value={editorValue}
                        // onChange={handleEditorChange}
                      />
                      // <textarea
                      //   placeholder="Write Your Answer Here..."
                      //   style={{ height: "300px" }} // Set the height
                      //   theme="snow"
                      //   value={editorHtml}
                      //   onChange={(value) => setEditorHtml(value)}
                      //   // modules={modules}
                      //   // formats={formats}
                      // />
                    )}

                    <br />
                    <button
                      type="button"
                      className="preview-btn"
                      onClick={() => setIsPreview(!isPreview)}
                    >
                      {isPreview ? "Edit" : "Preview"}
                    </button>

                    <input
                      type="submit"
                      className="post-ans-btn"
                      value="Post Your Answer"
                    />
                  </form>
                  <p>
                    Browse other Question tagged
                    {question.questionTags.map((tag) => (
                      <Link to="/Tags" key={tag} className="ans-tags">
                        {" "}
                        {tag}{" "}
                      </Link>
                    ))}{" "}
                    or
                    <Link
                      to="/AskQuestion"
                      style={{ textDecoration: "none", color: "#009dff" }}
                    >
                      {" "}
                      Ask your own Question.
                    </Link>
                  </p>
                </section>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default QuestionsDetails;
