import { useState } from "react";

export default function SkillInput({ label, skills, setSkills }) {
  const [input, setInput] = useState("");

  const addSkill = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!skills.includes(input.trim())) {
        setSkills([...skills, input.trim()]);
      }
      setInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-teal-500 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a skill and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addSkill}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
}
