// import { FaTwitter, FaYoutube, FaFacebook, FaAtom } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-base-300 text-base-content border-t border-base-200 mt-10">
//       <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//         {/* LEFT - Branding */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
//             <FaAtom className="text-xl text-primary" />
//           </div>

//           <div>
//             <h2 className="text-sm font-semibold">DevConnect</h2>
//             <p className="text-xs opacity-60">
//               Build meaningful developer connections
//             </p>
//           </div>
//         </div>

//         {/* CENTER - Links */}
//         <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
//           <a className="hover:text-primary transition cursor-pointer">About</a>
//           <a className="hover:text-primary transition cursor-pointer">
//             Privacy
//           </a>
//           <a className="hover:text-primary transition cursor-pointer">Terms</a>
//           <a className="hover:text-primary transition cursor-pointer">
//             Contact
//           </a>
//         </div>

//         {/* RIGHT - Socials */}
//         <div className="flex gap-4 justify-center md:justify-end text-lg">
//           <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
//             <FaTwitter />
//           </a>

//           <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
//             <FaYoutube />
//           </a>

//           <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
//             <FaFacebook />
//           </a>
//         </div>
//       </div>

//       {/* Bottom line */}
//       <div className="text-center text-xs opacity-60 pb-4">
//         © {new Date().getFullYear()} DevConnect. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import {
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaAtom,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";
import { FiMail, FiArrowUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Contact", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter />,
      href: "https://twitter.com",
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "GitHub",
      icon: <FaGithub />,
      href: "https://github.com",
      color: "hover:text-[#333]",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      href: "https://linkedin.com",
      color: "hover:text-[#0077b5]",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      href: "https://instagram.com",
      color: "hover:text-[#E4405F]",
    },
  ];

  return (
    <>
      <footer className="bg-base-200 border-t border-base-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                  <FaAtom className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">ConnectDEV</h2>
                  <p className="text-xs text-base-content/60">
                    Build developer connections
                  </p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Join thousands of developers sharing knowledge and growing
                together.
              </p>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <FiMail size={14} />
                <span>hello@connectdev.com</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-base-content mb-3">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm text-base-content/60 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base-content mb-2">
                  Stay Updated
                </h3>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="input input-bordered input-sm flex-1"
                  />
                  <button className="btn btn-primary btn-sm">Subscribe</button>
                </form>
              </div>

              <div>
                <h3 className="font-semibold text-base-content mb-2">
                  Follow Us
                </h3>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg bg-base-100 hover:bg-base-300 transition-all duration-200 text-base-content/60 ${social.color} hover:scale-105`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-base-content/50 flex items-center gap-1">
              Made with <FaHeart size={10} className="text-error" /> by
              ConnectDEV Team
            </p>
            <p className="text-xs text-base-content/40">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-2.5 bg-primary hover:bg-primary-focus text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}
    </>
  );
};

export default Footer;
