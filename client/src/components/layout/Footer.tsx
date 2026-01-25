export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-14 bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-6 sm:gap-10 md:grid-cols-4">
          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold">Quick Links</h3>
            <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a className="hover:text-white" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/schedule">
                  Schedule
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/gallery">
                  Gallery
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/admin">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold">Contact Info</h3>
            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <div className="break-all">info@collegesports.edu</div>
              <div>+91 98765 43210</div>
              <div className="hidden sm:block">
                Address: Sitapura, Jaipur <br />
                Rajasthan, India
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="hidden sm:block">
            <h3 className="text-base sm:text-lg font-extrabold">Follow Us</h3>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80">
              Facebook • Instagram • YouTube
            </div>
          </div>

          {/* Location Map */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base sm:text-lg font-extrabold">Location</h3>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80">
              Apex Institute of Engineering and Technology, Sitapura Jaipur
            </p>

            {/* Responsive Map */}
            <div className="mt-3 sm:mt-4 overflow-hidden rounded-lg border border-white/10 shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.308984873634!2d75.84953027543442!3d26.766418976734663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9ee616c7551%3A0x166db839a656b446!2sApex%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1769331680733!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Apex Institute of Engineering and Technology Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 sm:mt-10 border-t border-white/15 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-white/70">
          © {new Date().getFullYear()} Apex University Sports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
