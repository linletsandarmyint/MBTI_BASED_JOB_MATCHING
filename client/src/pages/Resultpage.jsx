import { useEffect, useState } from "react";
import API from "../api/authApi";
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

import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

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

/* -------------------- COMPARE MODAL (uses Modal) -------------------- */
const CompareModal = ({ data, onClose }) => {
  if (!data) return null;

  const prev = data.previous?.mbtiType?.split("") || [];
  const curr = data.current?.mbtiType?.split("") || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <Modal title="MBTI Comparison" onClose={onClose} className="w-full max-w-md">
      <div className="text-center text-teal-600 font-bold text-xl mb-4">
        {data.previous?.mbtiType} → {data.current?.mbtiType}
      </div>

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

      <div className="flex justify-end mt-4">
        <Button variant="secondary" size="md" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

/* -------------------- TYPE MODAL (uses Modal) -------------------- */
const TypeModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Modal title={`${data.type} Personality`} onClose={onClose} className="w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center">
          {data.type}
        </div>
        <div>
          <h3 className="font-semibold text-xl">{data.type} Personality</h3>
          <p className="text-sm text-gray-500">{data.summary}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Key Strengths" icon={Sparkles} items={data.keyStrengths} />
        <InfoCard title="Work Style Preferences" icon={Briefcase} items={data.workStylePreferences} />
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="primary" size="md" onClick={onClose}>Close</Button>
      </div>
    </Modal>
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  /* FETCH USER MBTI */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/mbti/my-mbti');
        if (res?.data?.mbtiType) setMbtiType(res.data.mbtiType);
        else setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    load();
  }, []);

  /* FETCH DESCRIPTION */
  useEffect(() => {
    if (!mbtiType) return;
    const load = async () => {
      try {
        const res = await API.get(`/mbti/descriptions/${mbtiType}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mbtiType]);

  /* FETCH ALL TYPES */
  useEffect(() => {
    API.get('/mbti/all-types').then((res) => setAllTypes(res.data)).catch((e)=>console.error(e));
  }, []);

  /* FETCH HISTORY */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/mbti/compare');
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

  const openCompare = async () => {
    try {
      const res = await API.get('/mbti/compare');
      setCompareData(res.data);
      setCompareOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Compare failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data available</div>;

  const ActiveIcon = traitCards.find((t) => t.key === activeTrait).icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My MBTI Result</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/mbti/test')} className="px-4 py-2 bg-white rounded-xl border">Retake</button>
            <button onClick={openCompare} className="px-4 py-2 bg-teal-500 text-white rounded-xl">Compare</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center text-xl">{mbtiType}</div>
                <div>
                  <h2 className="text-xl font-bold">{data.title || mbtiType}</h2>
                  <p className="text-sm text-gray-500">{data.summary}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {traitCards.map((t) => (
                  <div key={t.key} className={`p-4 rounded-xl border ${t.key === activeTrait ? 'border-teal-200' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <t.icon size={18} className="text-teal-600" />
                        <div>
                          <h4 className="font-semibold">{t.title}</h4>
                          <p className="text-sm text-gray-500">{data[t.key]?.short}</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTrait(t.key)} className="text-sm text-teal-600">View</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Detailed</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{data.detailed}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold mb-3">Career Suggestions</h3>
              <ul className="space-y-2 text-gray-700">
                {(data.careerSuggestions || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal-500">•</span>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h4 className="font-semibold mb-3">Traits</h4>
              <div className="space-y-3">
                {Object.entries(data.traits || {}).map(([k, v]) => (
                  <InfoCard key={k} title={k} icon={Info} items={v} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h4 className="font-semibold mb-3">History</h4>
              <div className="space-y-2 text-sm text-gray-700">
                {history.length === 0 ? <div className="text-gray-500">No previous attempts</div> : history.map((h, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>{h.mbtiType}</div>
                    <div className="text-gray-500">{formatDate(h.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {(compareOpen && <CompareModal data={compareData} onClose={() => setCompareOpen(false)} />)}
        {(modalData && <TypeModal data={modalData} onClose={() => setModalData(null)} />)}
      </div>
    </div>
  );
};

export default ResultPage;
