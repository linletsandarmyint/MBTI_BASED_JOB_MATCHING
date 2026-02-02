export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
      <div className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Discover Your Career Path
          <br />
          Through Personality
        </h1>
        <p className="text-lg mb-8">
          Take the MBTI test and unlock careers made for you.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="#mbti"
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold"
          >
            Take the MBTI Test
          </a>
          <a
            href="#jobs"
            className="border border-white px-6 py-3 rounded-lg font-semibold"
          >
            Explore Jobs
          </a>
        </div>
      </div>
    </section>
  );
}
