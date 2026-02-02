import { Info, AlertCircle } from "lucide-react";

export default function AboutAndLimitations() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      {/* LEFT PANEL: Who We Are */}
      <div className="flex flex-col gap-6">
        <Info className="w-16 h-16 text-teal-500 mx-auto md:mx-0" />
        <h2 className="text-3xl font-bold text-gray-900 text-center md:text-left">
          Who We Are
        </h2>
        <p className="text-gray-600 text-center md:text-left">
          TypePath Careers was founded by a team of career counselors,
          organizational psychologists, and software engineers who believe that
          understanding yourself is the first step to finding fulfilling work.
        </p>
        <p className="text-gray-600 text-center md:text-left">
          Our mission is to democratize career guidance by making
          personality-based insights accessible to everyone, whether you're a
          student exploring options or a professional seeking change.
        </p>
      </div>

      {/* RIGHT PANEL: Limitations */}
      <div className="flex flex-col gap-6">
        <AlertCircle className="w-16 h-16 text-purple-500 mx-auto md:mx-0" />
        <h2 className="text-3xl font-bold text-gray-900 text-center md:text-left">
          Understanding the Limitations
        </h2>
        <ul className="text-gray-600 space-y-4 list-disc list-inside">
          <li>
            MBTI describes preferences, not abilities. People of any type can
            succeed in any career with the right motivation and development.
          </li>
          <li>
            Your type may evolve over time. We recommend retaking the assessment
            periodically, especially during major life transitions.
          </li>
          <li>
            Combine MBTI insights with skills assessments, values clarification,
            and practical experience for a complete career picture.
          </li>
        </ul>
      </div>
    </section>
  );
}
