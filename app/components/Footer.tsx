import { Link } from "react-router";
import { CircleFlag } from "react-circle-flags";
import { useState } from "react";

const Footer = () => {
  const [country, setCountry] = useState({
    code: "in",
    name: "India",
  });

  const [open, setOpen] = useState(false);

  const countries = [
    { code: "us", name: "United States" },
    { code: "in", name: "India" },
  ];

  return (
    <footer
      className="
        border-t
        border-slate-300
        bg-[#DDE3F0]
        py-6
        transition-colors
        duration-300
        dark:bg-[#111827]
        dark:border-slate-700
      "
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left */}
        <p className="text-sm text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} AI Resume Analyzer
        </p>

        {/* Center */}
        <div className="flex items-center gap-5 text-sm">
          <a
            href="https://www.linkedin.com/in/johann-alvares"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
          >
            LinkedIn
          </a>

          <span className="text-gray-500 dark:text-gray-500">|</span>

          <a
            href="mailto:johannalvares05@yahoo.com"
            className="transition-colors text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
          >
            Contact
          </a>

          <span className="text-gray-500 dark:text-gray-500">|</span>

          <a
            href="https://github.com/johannalvares1203"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
          >
            GitHub
          </a>
        </div>

        {/* Right */}
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="
              flex
              items-center
              gap-2
              text-sm
              text-gray-700
              transition-colors
              hover:text-indigo-600
              dark:text-gray-300
              dark:hover:text-indigo-400
            "
          >
            <CircleFlag
              countryCode={country.code}
              className="w-5 h-5 rounded-full"
            />
            <span>{country.name}</span>
          </button>

          {open && (
            <div
              className="
                absolute
                right-0
                bottom-10
                w-56
                overflow-hidden
                rounded-2xl
                border
                border-slate-300
                bg-white
                shadow-xl
                py-2
                transition-colors
                duration-300
                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              {countries.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setCountry(item);
                    setOpen(false);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-gray-700
                    transition-colors
                    hover:bg-slate-100
                    dark:text-gray-200
                    dark:hover:bg-slate-700
                  "
                >
                  <CircleFlag
                    countryCode={item.code}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;