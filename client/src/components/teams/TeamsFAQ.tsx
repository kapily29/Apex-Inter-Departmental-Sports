const faqs = [
  {
    id: 1,
    question: "How can I join a sports team?",
    icon: "➤",
  },
  {
    id: 2,
    question: "Are there tryouts for all teams?",
    icon: "➤",
  },
  {
    id: 3,
    question: "Who are the coaches for each sport?",
    icon: "➤",
  },
  {
    id: 4,
    question: "How often do teams practice?",
    icon: "➤",
  },
];

export default function TeamsFAQ() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
        Frequently Asked Questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {faq.question}
              </h3>
              <span className="text-xl text-slate-600">{faq.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
