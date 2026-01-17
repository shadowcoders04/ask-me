import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AllRoutes from "./AllRoutes";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 760) {
      setSlideIn(false);
    }
  }, []);

  const handleSlideIn = () => {
    if (window.innerWidth <= 760) {
      setSlideIn((state) => !state);
    }
  };

  return (
    <div
      className="App"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Router>
        <Navbar handleSlideIn={handleSlideIn} />

        <ToastContainer
          position="top-center"
          limit={3}
          closeButton={false}
          theme="colored"
        />

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <AllRoutes
            slideIn={slideIn}
            handleSlideIn={handleSlideIn}
          />
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "10px 0",
            fontSize: "14px",
            color: "#666",
            borderTop: "1px solid #eaeaea",
            backgroundColor: "#fff"
          }}
        >
          Powered By Shadow Coder'S
        </footer>

      </Router>
    </div>
  );
}

export default App;
