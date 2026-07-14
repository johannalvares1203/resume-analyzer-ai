import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (
      saved === "dark" ||
      (!saved &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-10 w-20 items-center rounded-full p-1 transition-all duration-300 ${
        dark ? "bg-slate-800" : "bg-slate-300"
      }`}
    >
      {/* Toggle Circle */}
      <div
        className={`absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
          dark ? "translate-x-10" : "translate-x-0"
        }`}
      >
        {dark ? (
          <Moon size={16} className="text-slate-700" />
        ) : (
          <Sun size={16} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;