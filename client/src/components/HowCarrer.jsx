import { UserCheck, Briefcase, Filter, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HowTypePathWorks() {
  const features = [
    {
      icon: UserCheck,
      title: "Personality Assessment",
      description:
        "Take our research-backed quiz to identify your MBTI type. We analyze your cognitive preferences across four key dimensions: energy, information processing, decision-making, and lifestyle orientation",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: Briefcase,
      title: "Role Mapping Algorithm",
      description:
        "Our system maps each MBTI type to career characteristics that research shows lead to satisfaction and success. We consider work environment preferences, communication styles, and natural aptitudes.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Filter,
      title: "Personalized Matches",
      description:
        "Receive curated job suggestions categorized as core fits or stretch roles. Refine your results by adding interests and preferences, and save favorites to track opportunities over time.",
    },
    {
      icon: Star,
      title: "Apply Favorites",
      description:
        "Save jobs that match your personality and skills after your test. Easily revisit your favorites, compare opportunities, and focus on the roles that truly suit you.",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 rounded-xl">
      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-black">
          How TypePath Matching Works
        </h2>
        <p className="text-gray-600 mt-2 py-2 max-w-2xl mx-auto">
          Learn how our platform guides you from discovering your personality
          type to finding the career that fits you best.
        </p>
      </div>

      {/* FEATURES GRID */}
      <div className="grid md:grid-cols-4 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              className="border rounded-2xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform shadow-sm shadow-black/5"
              whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            >
              {/* ICON BADGE */}
              <div className={`p-6 rounded-full ${feature.color}`}>
                <Icon size={40} />
              </div>
              {/* TITLE */}
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm mb-6">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* CALL TO ACTION BUTTON */}
      <div className="text-center mt-12">
        <button className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-teal-700 transition">
          Start the MBTI Quiz Now
        </button>
      </div>
    </section>
  );
}
