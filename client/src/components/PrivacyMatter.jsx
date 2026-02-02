import { ShieldCheck, UserCheck, Lock, Mail } from "lucide-react";

const privacyItems = [
  {
    icon: <UserCheck className="text-teal-500 w-12 h-12" />,
    title: "Anonymous by Default",
    description:
      "Take the quiz and explore matches without creating an account or sharing any personal information.",
  },
  {
    icon: <ShieldCheck className="text-purple-500 w-12 h-12" />,
    title: "Never Sold to Employers",
    description:
      "Your personality data and job preferences are never shared with recruiters or companies without your explicit consent.",
  },
  {
    icon: <Lock className="text-yellow-500 w-12 h-12" />,
    title: "Data You Control",
    description:
      "Edit, export, or delete your profile data at any time. You decide what to share and keep.",
  },
  {
    icon: <Mail className="text-pink-500 w-12 h-12" />,
    title: "Opt-In Communications",
    description:
      "We only send emails you've asked for. No spam, no marketing without your permission.",
  },
];

export default function PrivacySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        Your Privacy Matters
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
        We prioritize your data security and privacy. Your information is never
        shared without your consent, and all personal data is handled
        responsibly.
      </p>

      <div className="flex flex-col gap-12">
        {privacyItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center md:items-start gap-6 ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <div className="max-w-lg text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
