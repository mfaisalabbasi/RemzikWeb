export default function About() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
        About Remzik
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700">
          Remzik’s mission is to enable transparent, Shariah-compliant ownership
          of real-world assets. We start with real estate and aim to expand
          globally, providing investors with safe, digital asset opportunities.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="text-gray-700">
          To become the most trusted platform for tokenized real-world assets,
          bridging traditional investments with modern digital finance while
          strictly adhering to Shariah principles.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Transparency & Trust</li>
          <li>Shariah Compliance</li>
          <li>Investor Protection</li>
          <li>Innovation & Sustainability</li>
        </ul>
      </section>
    </main>
  );
}
