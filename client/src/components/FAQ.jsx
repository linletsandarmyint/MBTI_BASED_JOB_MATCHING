import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How accurate is MBTI for career matching?",
    answer:
      "MBTI is a well-researched framework used by career counselors worldwide. While no personality assessment is 100% predictive, MBTI provides valuable insights into work preferences and natural strengths that correlate with job satisfaction. We recommend using it as one input alongside skills, values, and practical experience.",
  },
  {
    question: "How long does the quiz take?",
    answer:
      "Our MBTI-style assessment takes approximately 5-10 minutes to complete. We've designed it to be thorough enough for accurate results while respecting your time. You can pause and resume if needed, and your progress is saved locally.",
  },
  {
    question: "How often should I retake the assessment?",
    answer:
      "We recommend retaking the quiz every 1-2 years or after major life events like graduating, changing careers, or significant personal growth experiences. Your core type tends to remain stable, but how you express your preferences can evolve.",
  },
  {
    question: "Can I use the app without creating an account?",
    answer:
      "Yes! You can take the quiz and see sample job matches completely anonymously. Creating an account is optional and only needed if you want to save your results, track job matches over time, or receive personalized recommendations.",
  },
  {
    question: "How is my data used and protected?",
    answer:
      "We take privacy seriously. Your quiz answers and preferences are only used to generate job recommendations—never sold or shared with employers without your explicit consent. You can delete your data at any time, and anonymous users have no stored data at all. See our Privacy Policy for complete details.",
  },
  {
    question: "What if I don't agree with my results?",
    answer:
      "That's completely normal! Your quiz result is a starting point, not a definitive label. We encourage you to read about similar types and explore if another resonates more. You can also retake the quiz while being mindful of how you answered previously. The goal is self-discovery, not rigid categorization.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-5 cursor-pointer"
            onClick={() => toggle(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-teal-500 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>
            {openIndex === index && (
              <p className="text-gray-600 mt-3">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
