export default function MbtiDashboard() {
  return (
    <section id="mbti" className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your MBTI Type</h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
              🧠 INFJ
            </span>
          </div>

          <p className="text-gray-600 mt-3">
            Advocate personality — thoughtful, insightful, value-driven.
          </p>

          <ul className="text-sm text-gray-500 mt-3 space-y-1">
            <li>• Strong intuition</li>
            <li>• Empathetic nature</li>
            <li>• Purpose-focused</li>
          </ul>

          <a
            href="#mbti-types"
            className="inline-block mt-4 text-teal-600 underline"
          >
            View full MBTI type info
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">MBTI Assessment</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              ✔ Completed
            </span>
          </div>

          <p className="text-gray-600 mt-3">
            You have completed the MBTI assessment.
          </p>

          <div className="mt-4 flex gap-4">
            <a href="#" className="text-teal-600 underline">
              Retake Test
            </a>
            <a href="#mbti-types" className="text-teal-600 underline">
              View Type Result
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
