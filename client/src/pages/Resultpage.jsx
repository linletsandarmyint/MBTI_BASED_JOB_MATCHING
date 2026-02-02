import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Zap,
  Brain,
  HeartHandshake,
  Compass,
  Sparkles,
  Briefcase,
  GitCompare,
  Search,
  Info,
  History,
  X,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

axios.defaults.baseURL = "http://localhost:5000/api";

/* -------------------- CONFIG -------------------- */
const traitCards = [
  { key: "energy", title: "Energy", icon: Zap },
  { key: "information", title: "Information", icon: Brain },
  { key: "decisions", title: "Decisions", icon: HeartHandshake },
  { key: "lifestyle", title: "Lifestyle", icon: Compass },
];

/* -------------------- INFO CARD -------------------- */
const InfoCard = ({ title, icon: Icon, items }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={20} className="text-teal-600" />
      <h4 className="font-semibold text-base">{title}</h4>
    </div>
    <ul className="space-y-2 text-sm text-gray-700">
      {items?.map((item, idx) => (
        <li key={idx} className="flex gap-2">
          <span className="text-teal-500">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

/* -------------------- COMPARE MODAL -------------------- */
const CompareModal = ({ data, onClose }) => {
  if (!data) return null;

  const prev = data.previous.mbtiType.split("");
  const curr = data.current.mbtiType.split("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-teal-600 text-lg">
            MBTI Comparison
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="text-center text-teal-600 font-bold text-xl mb-4">
          {data.previous.mbtiType} → {data.current.mbtiType}
        </div>

        {/* Comparison */}
        <div className="space-y-2">
          {prev.map((p, i) => {
            const c = curr[i];
            const same = p === c;
            return (
              <div
                key={i}
                className="flex justify-between text-teal-700 bg-gray-50 p-3 rounded-xl text-sm"
              >
                <span>
                  {p} → {c}
                </span>
                <span>
                  {same ? (
                    <CheckCircle size={20} className="text-teal-600" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------- TYPE MODAL -------------------- */
const TypeModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[460px] rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center">
              {data.type}
            </div>
            <h3 className="font-semibold text-xl">{data.type} Personality</h3>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <InfoCard
            title="Key Strengths"
            icon={Sparkles}
            items={data.keyStrengths}
          />
          <InfoCard
            title="Work Style Preferences"
            icon={Briefcase}
            items={data.workStylePreferences}
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------- MAIN PAGE -------------------- */
const ResultPage = () => {
  const [mbtiType, setMbtiType] = useState(null);
  const [data, setData] = useState(null);
  const [activeTrait, setActiveTrait] = useState("energy");
  const [allTypes, setAllTypes] = useState({});
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  /* ---------- FORMAT DATE ---------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  /* ---------- FETCH USER MBTI ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await axios.get("/mbti/my-mbti", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMbtiType(res.data.mbtiType);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- FETCH DESCRIPTION ---------- */
  useEffect(() => {
    if (!mbtiType) return;
    const load = async () => {
      const res = await axios.get(`/mbti/descriptions/${mbtiType}`);
      setData(res.data);
      setLoading(false);
    };
    load();
  }, [mbtiType]);

  /* ---------- FETCH ALL TYPES ---------- */
  useEffect(() => {
    axios.get("/mbti/all-types").then((res) => setAllTypes(res.data));
  }, []);

  /* ---------- FETCH HISTORY ---------- */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("/mbti/compare", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure history is an array
        const h = [];
        if (res.data.previous) h.push(res.data.previous);
        if (res.data.current) h.push(res.data.current);
        setHistory(h.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  /* ---------- OPEN COMPARE MODAL ---------- */
  const openCompare = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const res = await axios.get("/mbti/compare", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompareData(res.data);
      setCompareOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || "Compare failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data available</div>;

  const ActiveIcon = traitCards.find((t) => t.key === activeTrait).icon;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-6xl mx-auto space-y-10">
        {/* HERO HEADER */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-16 px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Your Personality Result
            </h1>
            <p className="text-sm md:text-base max-w-xl mx-auto opacity-90">
              Explore your strengths, work style, and personality insights to
              understand what makes you unique.
            </p>
          </div>
        </div>

        {/* MBTI CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold text-2xl flex items-center justify-center shadow">
              {mbtiType}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{mbtiType}</h2>
              <p className="text-sm text-gray-500">
                Myers–Briggs Personality Type
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openCompare}
              className="flex items-center text-teal-600 gap-2 px-4 py-2 border rounded-xl"
            >
              <GitCompare size={16} /> Compare
            </button>
          </div>
        </div>

        {/* TRAITS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {traitCards.map(({ key, title, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTrait(key)}
                className={`rounded-2xl p-4 border transition-all ${activeTrait === key ? "bg-teal-50 border-teal-500 shadow" : "hover:bg-gray-50"}`}
              >
                <Icon className="mx-auto text-teal-600" />
                <p className="text-sm mt-2 text-center">{title}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ActiveIcon className="text-teal-600" />
              <h3 className="font-semibold">
                {traitCards.find((t) => t.key === activeTrait).title}
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              {data.traitBreakdown[activeTrait]}
            </p>
          </div>
        </div>

        {/* STRENGTHS & WORK STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="Key Strengths"
            icon={Sparkles}
            items={data.keyStrengths}
          />
          <InfoCard
            title="Work Style Preferences"
            icon={Briefcase}
            items={data.workStylePreferences}
          />
        </div>

        {/* CAREERS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Recommended Career Areas</h3>
          <button
            onClick={() => navigate("/jobresult")}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm shadow"
          >
            <Search size={16} /> View Matched Jobs
          </button>
        </div>

        {/* TEST HISTORY */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <History size={18} className="text-teal-600" />
            <span className="font-semibold">Test History</span>
            
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No tests taken yet.</p>
          ) : (
            history.map((attempt, idx) => (
              <div
                key={attempt._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {attempt.previous && attempt.current ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-teal-500" />
                        <span className="text-gray-700 text-sm">
                          {formatDate(attempt.previous.createdAt)}
                        </span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-teal-500" />
                        <span className="text-gray-700 text-sm">
                          {formatDate(attempt.current.createdAt)}
                        </span>
                      </div>
                    </>
                  ) : (
                    // single test fallback
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-teal-500" />
                      <span className="text-gray-700 text-sm">
                        {formatDate(attempt.createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                

                
              </div>
            ))
          )}
        </div>

        {/* DID YOU KNOW */}
        <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl p-5 border">
          <div className="flex items-center gap-2 mb-1">
            <Info size={16} />
            <h4 className="font-semibold text-sm">Did you know?</h4>
          </div>
          <p className="text-xs text-gray-600">
            Less than 10% of people share your MBTI type — making your
            perspective uniquely valuable.
          </p>
        </div>

        {/* EXPLORE TYPES */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Explore All Personality Types</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(allTypes).map((type) => (
              <button
                key={type}
                onClick={() => setModalData({ type, ...allTypes[type] })}
                className="border rounded-xl py-2 text-sm hover:bg-gray-50"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {modalData && (
        <TypeModal data={modalData} onClose={() => setModalData(null)} />
      )}
      {compareOpen && (
        <CompareModal
          data={compareData}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
};

export default ResultPage;
