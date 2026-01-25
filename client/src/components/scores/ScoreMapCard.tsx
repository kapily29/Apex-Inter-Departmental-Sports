export default function ScoreMapCard() {
  return (
    <div className="rounded-lg bg-white shadow overflow-hidden">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-extrabold text-slate-900">College Sports</h2>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.308984873634!2d75.84953027543442!3d26.766418976734663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9ee616c7551%3A0x166db839a656b446!2sApex%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1769331680733!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Apex Institute Location"
          />
        </div>

        <a
          href="/scores"
          className="mt-4 block rounded-md bg-yellow-500 px-4 py-3 text-center text-sm font-black text-slate-900 hover:bg-yellow-400"
        >
          View All Scores
        </a>
      </div>
    </div>
  );
}
