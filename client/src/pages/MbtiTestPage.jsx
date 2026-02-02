import { useState, useEffect } from "react";
import axios from "axios";
import { CiSaveDown2 } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { LuBrain } from "react-icons/lu";

export default function MbtiTestPage() {
  const TOTAL_QUESTIONS = 10;
  const QUESTIONS_PER_PAGE = 5;
  const [questions, setQuestions] = useState([]);
const questionsLength = Array.isArray(questions) ? questions.length : 0;
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({
  });
  // Fetch saved answers from backend when user is logged in
  useEffect(() => {
    const fetchSavedAnswers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/mbti/save", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.answers) setAnswers(res.data.answers);
      } catch (err) {
        console.error("Error fetching saved answers:", err);
      }
    };

    fetchSavedAnswers();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mbti/random"); // your backend endpoint
        console.log(res.data);
         setQuestions(res.data.questions || []);// set the random 10 questions
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = Array.isArray(questions)
    ? questions.slice(startIndex, endIndex)
    : [];


  const answeredCount = questions.reduce((count, q) => {
    return answers[q._id] ? count + 1 : count;
  }, 0);

  const remainingCount = questions.length - answeredCount;
  const progressPercent = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  const handleAnswer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleRetake = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first!");
        return;
      }

      // 🔥 Ask backend if retake is allowed
      await axios.post(
        "http://localhost:5000/api/mbti/retake",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ Reset frontend state
      setAnswers({});
      setCurrentPage(1);

      // ✅ Fetch new random questions
      const res = await axios.get("http://localhost:5000/api/mbti/random", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(res.data.questions || []);
      alert("You can retake the test now!");
    } catch (err) {
      alert(err.response?.data?.message || "Retake not allowed yet");
    }
  };


  
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    // Check if all questions answered
    if (Object.keys(answers).length < TOTAL_QUESTIONS) {
      alert("Please answer all questions!");
      return;
    }
    // Map answers to the current questions by _id
    const formattedAnswers = questions.map((q) => answers[q._id] || null);

    // Check if all questions are answered
    if (formattedAnswers.some((a) => a === null)) {
      alert("Please answer all questions!");
      return;
    }

    // Submit to backend
    const res = await axios.post(
      "http://localhost:5000/api/mbti/submit",
      { answers: formattedAnswers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("Your MBTI Type is: " + res.data.mbtiType);
  } catch (err) {
    console.error("Submit Error:", err);
    alert(err.response?.data?.message || "Failed to submit test!");
  }
};
const [attempts, setAttempts] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios
    .get("http://localhost:5000/api/mbti/attempts", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setAttempts(res.data))
    .catch(() => {});
}, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-16">
        <h1 className="text-3xl font-bold mb-2">
          Discover Your MBTI Personality Type
        </h1>
        <p className="text-sm max-w-xl mx-auto opacity-90">
          Answer the questions below to uncover insights about your personality
          and find careers that align with who you are.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          {/* Test Status */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <LuBrain className="w-8 h-8 text-teal-600 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Test Status</p>
              <p className="font-semibold text-teal-600">Ready to Begin</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Your Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{answeredCount} Answered</span>
              <span>{remainingCount} Remaining</span>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Tips for Best Results</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Answer honestly, not ideally</li>
              <li>• Don’t overthink questions</li>
              <li>• Choose what feels natural</li>
              <li>• No right or wrong answers</li>
            </ul>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">MBTI Assessment</h2>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                >
                  Retake Test
                </button>
                
              </div>
            </div>

            {loading ? (
              <p>Loading questions...</p>
            ) : Array.isArray(currentQuestions) &&
              currentQuestions.length > 0 ? (
              currentQuestions.map((q, index) => (
                <div key={q._id} className="mb-6 p-4 rounded-lg bg-gray-50">
                  <p className="font-medium mb-3">
                    {startIndex + index + 1}. {q.question}
                  </p>
                  <div className="space-y-1 text-sm text-gray-700">
                    {q.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          className="accent-teal-600"
                          checked={answers[q._id] === option.value}
                          onChange={() => handleAnswer(q._id, option.value)}
                        />
                        {option.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No questions available</p>
            )}

            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <button
                onClick={() => setCurrentPage(currentPage - 1)} // <- using setCurrentPage
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ← Previous
              </button>

              {/* Save */}
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token"); // ✅ get token from login
                    if (!token) {
                      alert("Please log in first!");
                      return;
                    }

                    const res = await axios.post(
                      "http://localhost:5000/api/mbti/save",
                      { answers },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`, // ✅ send token to backend
                        },
                      },
                    );

                    alert(res.data.message || "Progress saved!");
                  } catch (err) {
                    console.error("Save Progress Error:", err);
                    alert(
                      err.response?.data?.message || "Failed to save progress!",
                    );
                  }
                }}
                className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100"
              >
                <CiSaveDown2 className="w-5 h-5" />
                Save Progress
              </button>

              <button
                onClick={() => setCurrentPage(currentPage + 1)} // <- using setCurrentPage
                disabled={endIndex >= questionsLength}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Next →
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {/* Check icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl">
                ✓
              </div>
            </div>

            <h3 className="font-semibold mb-2">Ready to submit?</h3>

            <p className="text-sm text-gray-600 mb-4">
              Make sure you’ve answered all questions honestly.
            </p>
            <button
              onClick={handleSubmit}
              disabled={answeredCount < TOTAL_QUESTIONS}
              className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 disabled:opacity-50 active:scale-95 transition"
            >
              <LuSend /> Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
