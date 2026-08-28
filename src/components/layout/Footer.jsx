import { FaGithub } from "react-icons/fa";
import { HiCode } from "react-icons/hi";

const Footer = () => (
  <footer className="mt-10 border-t border-base-200 bg-base-300 text-base-content">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HiCode aria-hidden="true" size={22} />
        </span>
        <div>
          <p className="text-sm font-semibold">Connect_DEV</p>
          <p className="text-xs text-base-content/60">
            Build meaningful developer connections.
          </p>
        </div>
      </div>
      <a
        href="https://github.com/Talhaayubkhan/connectDev-frontend"
        target="_blank"
        rel="noreferrer"
        className="btn btn-circle btn-ghost"
        aria-label="View ConnectDev frontend on GitHub"
      >
        <FaGithub aria-hidden="true" size={20} />
      </a>
    </div>
    <p className="pb-4 text-center text-xs text-base-content/60">
      © {new Date().getFullYear()} Connect_DEV.
    </p>
  </footer>
);

export default Footer;
