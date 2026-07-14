import { Link } from "react-router";
import { Search, Trash2, User } from "lucide-react";
import ThemeToggle from "~/components/ThemeToggle";

const Navbar = () => {
  return (
    <header className="flex justify-center pt-5">
      <nav
        className="
          w-[94%]
          max-w-7xl
          rounded-2xl
          border
          border-slate-400
          bg-[#DDE3F0]
          shadow-xl
          shadow-slate-400/25
          transition-all
          duration-300

          dark:bg-[#111827]
          dark:border-slate-700
          dark:shadow-black/50
        "
      >
        <div className="flex h-16 items-center justify-between px-8">
          {/* Left */}
          <Link
            to="/"
            className="
              text-[2rem]
              font-bold
              tracking-tight
              whitespace-nowrap
              bg-clip-text
              text-transparent
              bg-gradient-to-r
              from-[#AB8C95]
              via-[#111827]
              to-[#8E97C5]
              dark:from-indigo-300
              dark:via-white
              dark:to-purple-300
            "
          >
            AI Resume Analyzer
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="flex h-10 w-64 items-center rounded-full bg-[#3B3B3F] px-4 transition-all duration-200 hover:bg-[#444448]">
              <Search
                size={20}
                className="text-gray-400 flex-shrink-0"
              />

              <input
                type="text"
                placeholder="Search"
                className="
                  !w-full
                  !bg-transparent
                  !border-0
                  !shadow-none
                  !rounded-none
                  !p-0
                  !ring-0
                  ml-3
                  text-base
                  font-medium
                  text-gray-100
                  placeholder:text-gray-400
                  outline-none
                "
              />
            </div>

            {/* Upload */}
            <Link
              to="/upload"
              className="
                flex
                h-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-indigo-500
                to-indigo-600
                px-5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-200
                hover:scale-[1.02]
                hover:shadow-lg
              "
            >
              Upload Resume
            </Link>

            {/* Clear */}
            <Link
              to="/wipe"
              title="Clear all resumes"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-300
                bg-white
                text-gray-600
                shadow-sm
                transition-all
                duration-200
                hover:bg-red-50
                hover:text-red-600

                dark:bg-slate-800
                dark:border-slate-700
                dark:text-gray-300
                dark:hover:bg-red-900/30
                dark:hover:text-red-400
              "
            >
              <Trash2 size={18} />
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile */}
            <button
              title="Profile"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
                text-white
                shadow-md
                transition-all
                duration-200
                hover:scale-105
              "
            >
              <User size={18} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;