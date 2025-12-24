export default function HowItWorks() {
  const steps = [
    {
      title: "Asset Identification",
      desc: "We carefully select high-quality real-world assets for tokenization.",
    },
    {
      title: "Shariah Structuring",
      desc: "Each asset is structured to comply with Shariah guidelines and transparency standards.",
    },
    {
      title: "Tokenized Ownership",
      desc: "Investors gain digital ownership of assets, backed by real value.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold text-green-600 mb-12">How It Works</h1>
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md p-6 rounded-lg flex-1 text-center"
          >
            <div className="text-2xl font-semibold text-green-600 mb-4">
              {step.title}
            </div>
            <p className="text-gray-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
