export default function Shariah() {
  const points = [
    {
      title: "Shariah Advisory Board",
      desc: "All assets are reviewed and approved by certified Shariah advisors to ensure compliance.",
    },
    {
      title: "Transparent Asset Structuring",
      desc: "Each asset follows a structured approach with clear ownership and profit distribution, fully Shariah-compliant.",
    },
    {
      title: "Investor Protection",
      desc: "Strict risk disclosure and governance policies protect investor interests at every step.",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-12 text-center">
        Shariah Compliance
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {points.map((point, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-lg p-6 flex-1">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              {point.title}
            </h2>
            <p className="text-gray-700">{point.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
