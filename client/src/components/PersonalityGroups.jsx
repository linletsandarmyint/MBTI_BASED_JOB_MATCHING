import { Cpu, Heart, Shield, Compass } from "lucide-react";

export default function PersonalityGroups() {
  const groups = [
    {
      icon: <Cpu size={36} className="text-purple-600" />,
      title: "Analysts (NT)",
      types: "INTJ • INTP • ENTJ • ENTP",
      description:
        "Strategic thinkers who excel at solving complex problems. They thrive in roles requiring innovation, logical analysis, and long-term planning. Common strengths include systems thinking, objective decision-making, and intellectual curiosity.",
      traits: ["Strategic Planning", "Problem Solving", "Innovation"],
    },
    {
      icon: <Heart size={36} className="text-pink-500" />,
      title: "Diplomats (NF)",
      types: "INFJ • INFP • ENFJ • ENFP",
      description:
        "Empathetic visionaries who connect deeply with people and causes. They excel in roles involving coaching, counseling, creative expression, and social impact. Common strengths include emotional intelligence, inspiring others, and seeing potential.",
      traits: ["Empathy", "Communication", "Inspiration"],
    },
    {
      icon: <Shield size={36} className="text-green-500" />,
      title: "Sentinels (SJ)",
      types: "ISTJ • ISFJ • ESTJ • ESFJ",
      description:
        "Dependable organizers who value structure and tradition. They excel in roles requiring attention to detail, process management, and team coordination. Common strengths include reliability, thoroughness, and creating stable systems.",
      traits: ["Organization", "Reliability", "Detail-Oriented"],
    },
    {
      icon: <Compass size={36} className="text-yellow-500" />,
      title: "Explorers (SP)",
      types: "ISTP • ISFP • ESTP • ESFP",
      description:
        "Adaptable doers who thrive in dynamic environments. They excel in roles requiring quick thinking, hands-on work, and flexibility. Common strengths include resourcefulness, practical problem-solving, and staying calm under pressure.",
      traits: ["Adaptability", "Hands-On Skills", "Quick Thinking"],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        The Four MBTI Personality Groups
      </h2>
      <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
        Explore the main personality groups, their traits, and the roles they
        excel in. Understand yourself and how you relate to others.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="border rounded-2xl p-6 flex flex-col items-center text-center bg-gray-100 hover:-translate-y-1 transition-transform shadow-sm"
          >
            <div className="mb-4">{group.icon}</div>
            <h3 className="text-xl font-semibold mb-1">{group.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{group.types}</p>
            <p className="text-gray-600 text-sm mb-4">{group.description}</p>
            <div className="flex flex-wrap justify-center gap-2 ">
              {group.traits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
