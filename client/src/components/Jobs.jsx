export default function Jobs() {
  const jobs = [
    {
      title: "UX Designer",
      description: "Perfect for INFJ & ENFP",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
    {
      title: "Psychologist",
      description: "Empathy-focused role",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    },
    {
      title: "Content Strategist",
      description: "Creative & analytical",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
  ];

  return (
    <section id="jobs" className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Top Matched Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.title}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={job.image}
              alt={job.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
