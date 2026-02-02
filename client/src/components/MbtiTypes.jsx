export default function MbtiTypes() {
  return (
    <section id="mbti-types" className="max-w-7xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
              INFJ
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Quiet visionaries with deep insight.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
              ENFP
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Creative and enthusiastic explorers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
              INTJ
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Strategic and analytical thinkers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              ESFJ
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Caring community builders.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">All MBTI Types</h3>
          <div className="space-y-2 h-[360px] overflow-y-auto scrollbar-hide text-sm">
            {[
              ["INFJ", "Advocate"],
              ["ENFP", "Campaigner"],
              ["INTJ", "Architect"],
              ["ESFJ", "Consul"],
              ["ISTJ", "Logistician"],
              ["ISFJ", "Defender"],
              ["ENTP", "Debater"],
              ["INFP", "Mediator"],
              ["ENTJ", "Commander"],
              ["ENFJ", "Protagonist"],
              ["ISTP", "Virtuoso"],
              ["ESTP", "Entrepreneur"],
              ["ISFP", "Adventurer"],
              ["ESFP", "Entertainer"],
              ["INTP", "Logician"],
              ["ESTJ", "Executive"],
            ].map(([type, desc]) => (
              <div
                key={type}
                className="flex justify-between border p-2 rounded"
              >
                {type} <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
