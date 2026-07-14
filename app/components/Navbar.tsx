import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Trash2,
  User,
  Settings,
  CircleHelp,
  LogOut,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "~/components/ThemeToggle";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = usePuterStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [search, setSearch] = useState("");

  const pages = [
    {
      keywords: ["home", "landing", "main"],
      path: "/",
    },
    {
      keywords: ["upload", "resume", "analyze", "analysis"],
      path: "/upload",
    },
    {
      keywords: ["clear", "wipe", "delete", "remove"],
      path: "/wipe",
    },
  ];

  const handleSearch = () => {
    const query = search.toLowerCase().trim();

    if (!query) return;

    const page = pages.find((page) =>
      page.keywords.some((keyword) => keyword.includes(query))
    );

    if (page) {
      navigate(page.path);
      setSearch("");
    } else {
      alert(`No page found for "${query}"`);
    }
  };

  const MenuItem = ({
    icon,
    title,
    danger = false,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    danger?: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        group
        flex
        w-full
        items-center
        justify-between
        rounded-xl
        px-4
        py-3
        transition-all
        duration-200
  
        ${
          danger
            ? "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            : "hover:bg-indigo-50 dark:hover:bg-slate-800"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {icon}

        <span className="font-medium">{title}</span>
      </div>

      <ChevronRight
        size={16}
        className="
          opacity-0
          transition
          group-hover:translate-x-1
          group-hover:opacity-100
        "
      />
    </button>
  );

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
                onClick={handleSearch}
                className="
                  flex-shrink-0
                  cursor-pointer
                  text-gray-400
                  transition
                  hover:text-white
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search pages..."
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
            <div className="relative" ref={profileRef}>
              <button
                title="Profile"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500
                  text-white
                  shadow-md
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-lg
                "
              >
                {auth.user?.username ? (
                  <span className="text-sm font-bold uppercase">
                    {auth.user.username.substring(0, 2)}
                  </span>
                ) : (
                  <User size={18} />
                )}
              </button>

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-14
                    z-50
                    w-80
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white/95
                    backdrop-blur-xl
                    shadow-[0_25px_80px_rgba(0,0,0,0.18)]
                    dark:border-slate-700
                    dark:bg-slate-900/95
                  "
                >
                  {/* Header */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-7 text-white">
                    <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-8 left-8 h-20 w-20 rounded-full bg-white/10"></div>

                    <div className="relative flex items-center gap-4">
                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          bg-white/20
                          text-xl
                          font-bold
                          backdrop-blur
                        "
                      >
                        {auth.user?.username?.substring(0, 2).toUpperCase() ??
                          "AI"}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">
                          {auth.user?.username ?? "Guest"}
                        </h3>

                        <p className="text-sm text-white/80">
                          AI Resume Analyzer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="space-y-1 p-3">
                    <MenuItem
                      icon={<User size={18} />}
                      title="View Profile"
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                    />

                    <MenuItem
                      icon={<Settings size={18} />}
                      title="Edit Profile"
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                    />

                    <MenuItem
                        icon={<CircleHelp size={18} />}
                        title="Support"
                        onClick={() => {
                            // Opens the link in a new tab
                            window.open("https://docs.puter.com/getting-started/", "_blank");
                            setProfileOpen(false);
                        }}
                    />

                    <div className="my-2 border-t border-slate-200 dark:border-slate-700"></div>

                    <MenuItem
                      icon={<LogOut size={18} />}
                      title="Logout"
                      danger
                      onClick={async () => {
                        try {
                          if (auth.signOut) {
                            await auth.signOut();
                          }
                          setProfileOpen(false);
                          navigate("/auth");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                    <p className="text-center text-xs text-slate-500">
                      AI Resume Analyzer • v1.0
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;