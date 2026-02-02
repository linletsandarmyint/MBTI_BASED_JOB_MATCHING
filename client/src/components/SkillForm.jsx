import { useEffect, useState } from "react";
import axios from "axios";

export default function SkillForm({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [skillsDB, setSkillsDB] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [manualSkill, setManualSkill] = useState("");
  const [experience, setExperience] = useState("Beginner");

  const [selectedSkills, setSelectedSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH SKILLS ================= */
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await axios.get("http://localhost:5000/api/skills");

      setSkillsDB(res.data);
      setCategories([...new Set(res.data.map((s) => s.category))]);
    };

    fetchSkills();
  }, []);

  /* ================= FILTER ================= */
  const filteredSkills = skillsDB.filter((s) => {
    const categoryMatch = selectedCategory
      ? s.category === selectedCategory
      : true;
    const searchMatch = s.name.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  /* ================= ADD SKILL ================= */
  const addSkill = (skillName) => {
    if (!selectedCategory) {
      setError("Please select a category first");
      return;
    }

    if (!skillName || skillName.trim() === "") {
      setError("Skill name cannot be empty");
      return;
    }

    const skillObj = {
      skill: skillName.toLowerCase(),
      category: selectedCategory,
      experienceLevel: experience,
    };

    const exists = selectedSkills.find(
      (s) => s.skill === skillObj.skill && s.category === skillObj.category
    );

    if (!exists) {
      setSelectedSkills([...selectedSkills, skillObj]);
      setManualSkill("");
      setError("");
    }
  };

  /* ================= REMOVE ================= */
  const removeSkill = (skillName) => {
    setSelectedSkills(selectedSkills.filter((s) => s.skill !== skillName));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/skills",
        { skills: selectedSkills },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Skills saved successfully ✅");
      onClose();
    } catch {
      setError("Failed to save skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[620px] rounded-xl shadow-xl p-6">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-1">Your Skills</h2>
        <p className="text-gray-500 mb-4">
          Choose a category, select skills or type your own, and add experience.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* SELECTED SKILLS (FIXED UI) */}
        <div className="border rounded-lg p-2 mb-4 max-h-28 overflow-y-auto flex flex-wrap gap-1">
          {selectedSkills.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 bg-teal-50 border border-teal-200 rounded-full px-2 py-1 text-xs"
            >
              <span className="font-medium">{s.skill}</span>
              <span className="text-gray-500">{s.experienceLevel}</span>
              <button
                onClick={() => removeSkill(s.skill)}
                className="text-red-500 ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* CATEGORY + EXPERIENCE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setError(""); // ✨ clear error when category selected
              }}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-4">
          <label className="text-sm font-medium">Search skills</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setError("");
            }}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Type to search skills..."
          />
        </div>

        {/* DB SKILLS */}
        <div className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => addSkill(skill.name)}
              className="flex justify-between px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <span>{skill.name}</span>
              <span className="text-xs text-gray-400">{skill.category}</span>
            </div>
          ))}
        </div>

        {/* MANUAL */}
        <div className="mt-4">
          <label className="text-sm font-medium">Add manually</label>
          <div className="flex gap-2 mt-1">
            <input
              value={manualSkill}
              onChange={(e) => {
                setManualSkill(e.target.value);
                setError("");
              }}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type your skill..."
            />
            <button
              onClick={() => addSkill(manualSkill)}
              className="bg-teal-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Skills"}
          </button>
        </div>
      </div>
    </div>
  );
}
