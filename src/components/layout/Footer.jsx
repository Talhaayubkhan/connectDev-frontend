import { FaTwitter, FaYoutube, FaFacebook, FaAtom } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content border-t border-base-200 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* LEFT - Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
            <FaAtom className="text-xl text-primary" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">DevConnect</h2>
            <p className="text-xs opacity-60">
              Build meaningful developer connections
            </p>
          </div>
        </div>

        {/* CENTER - Links */}
        <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
          <a className="hover:text-primary transition cursor-pointer">About</a>
          <a className="hover:text-primary transition cursor-pointer">
            Privacy
          </a>
          <a className="hover:text-primary transition cursor-pointer">Terms</a>
          <a className="hover:text-primary transition cursor-pointer">
            Contact
          </a>
        </div>

        {/* RIGHT - Socials */}
        <div className="flex gap-4 justify-center md:justify-end text-lg">
          <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
            <FaTwitter />
          </a>

          <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
            <FaYoutube />
          </a>

          <a className="p-2 rounded-full hover:bg-base-200 hover:text-primary transition cursor-pointer">
            <FaFacebook />
          </a>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs opacity-60 pb-4">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
