export default function Welcome() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, <span className="text-teal-600">Alex</span>
          </h1>
          <p className="text-sm text-gray-500">
            Here's a snapshot of your personality and progress
          </p>
        </div>

        <a
          href="#"
          className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
        >
          ✏️ Edit Profile
        </a>
      </div>
    </section>
  );
}
