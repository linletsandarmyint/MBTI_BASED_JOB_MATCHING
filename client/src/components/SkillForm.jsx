import { useEffect, useState } from "react";
import api from "../api/authApi";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

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
      try {
        const res = await api.get("/skills");
        const data = res.data || [];
        setSkillsDB(data);
        setCategories([...new Set(data.map((s) => s.category))]);
      } catch (err) {
        console.warn("Failed to fetch skills", err);
      }
    };

    fetchSkills();
  }, []);

  /* ================= FILTER ================= */
  const filteredSkills = skillsDB.filter((s) => {
    const categoryMatch = selectedCategory ? s.category === selectedCategory : true;
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

    const exists = selectedSkills.find((s) => s.skill === skillObj.skill && s.category === skillObj.category);

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
      await api.post("/auth/skills", { skills: selectedSkills });

      alert("Skills saved successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Your Skills" onClose={onClose} className="w-full max-w-2xl hide-scrollbar">
      <p className="text-gray-500 mb-4">Choose a category, select skills or type your own, and add experience.</p>

      {error && <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-3">{error}</div>}

      <div className="border border-gray-200 rounded-lg p-3 mb-4 max-h-28 overflow-y-auto flex flex-wrap gap-2 hide-scrollbar">
        {selectedSkills.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 text-xs">
            <span className="font-medium">{s.skill}</span>
            <span className="text-gray-500">{s.experienceLevel}</span>
            <button onClick={() => removeSkill(s.skill)} className="text-red-500 ml-1">✕</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setError("");
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
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>
      </div>

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

      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 hide-scrollbar">
        {filteredSkills.map((skill) => (
          <div key={skill.id} onClick={() => addSkill(skill.name)} className="flex justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span>{skill.name}</span>
            <span className="text-xs text-gray-400">{skill.category}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Add manually</label>
        <div className="flex gap-2 mt-1">
          <input value={manualSkill} onChange={(e) => { setManualSkill(e.target.value); setError(""); }} className="flex-1 border rounded px-3 py-2" placeholder="Type your skill..." />
          <Button onClick={() => addSkill(manualSkill)} variant="primary">Add</Button>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="primary" disabled={loading}>{loading ? "Saving..." : "Save Skills"}</Button>
      </div>
    </Modal>
  );
}
