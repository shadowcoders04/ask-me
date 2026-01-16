import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!User) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => resolve(), 2000);
        }),
        {
          pending: 'Please Login or Signup to Ask Question.',
          success: {
            render() {
              return 'Login or Signup here.';
            },
          },
        }
      ).then(() => {
        setTimeout(() => {
          navigate('/Auth');
        }, 100);
      });
      return;
    }
    if (!questionTitle || !questionBody || !questionTags) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => resolve(), 2000);
        }),
        {
          pending: 'Please fill in all the fields.',
          error: {
            render() {
              return 'Please fill in all the fields.';
            },
          },
        }
      );
      return;
    }
    dispatch(
      askQuestion(
        {
          questionTitle,
          questionBody,
          questionTags,
          userPosted: User.result.name,
        },
        navigate
      )
    );
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      }),
      {
        success: 'Thank You! For Asking Quesstion Experts will be reply soon.',
      }
    )
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>
                Be specific and imagine you’re asking a question to another
                person
              </p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                }}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <br />
            <label htmlFor="ask-ques-body">
              <h4>What are the details of your problem?</h4>
              <p>
                Include all the information someone would need to answer your
                question
              </p>
              <textarea
                name=""
                id="ask-ques-body"
                onChange={(e) => {
                  setQuestionBody(e.target.value);
                }}
                cols="30"
                rows="10"
                onKeyPress={handleEnter}
              ></textarea>
            </label>
            <br />
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setQuestionTags(e.target.value.split(" "));
                }}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>
          </div>
          <input
            type="submit"
            value="Reivew your question"
            className="review-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
