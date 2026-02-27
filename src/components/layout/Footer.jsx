import { FaTwitter, FaYoutube, FaFacebook, FaAtom } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-base-300 text-base-content items-center px-6 py-5 border-t border-base-200">
      <aside className="grid-flow-col items-center gap-3">
        <FaAtom className="text-3xl opacity-80" />
        <p className="text-sm opacity-70">
          Copyright © {new Date().getFullYear()}
          <br className="sm:hidden" />
          All rights reserved
        </p>
      </aside>

      <nav className="grid-flow-col gap-6 md:place-self-center md:justify-self-end text-xl">
        <a className="hover:text-primary transition duration-300 cursor-pointer">
          <FaTwitter />
        </a>

        <a className="hover:text-primary transition duration-300 cursor-pointer">
          <FaYoutube />
        </a>

        <a className="hover:text-primary transition duration-300 cursor-pointer">
          <FaFacebook />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
