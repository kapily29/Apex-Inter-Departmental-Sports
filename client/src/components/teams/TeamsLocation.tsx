export default function TeamsLocation() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="rounded-lg shadow-lg overflow-hidden h-80 bg-slate-200 flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-4xl mb-2">📍</div>
            <div className="text-sm text-slate-600">College Sports</div>
            <div className="text-xs text-slate-500">Sample 25x, 31, 2044</div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              View Announcements
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">
              College Sports Center
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Located at the heart of our campus, the College Sports Center is
              the hub of all athletic activities. Our state-of-the-art facilities
              provide the perfect environment for training, competition, and
              community engagement.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">📍</span>
              <div>
                <div className="text-xs text-slate-500">Address</div>
                <div className="text-sm font-semibold text-slate-900">
                  College Ave, Sample City, ST 12345
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">📞</span>
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div className="text-sm font-semibold text-slate-900">
                  +1 234 567 8900
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">✉️</span>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-sm font-semibold text-slate-900">
                  info@collegesports.edu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
