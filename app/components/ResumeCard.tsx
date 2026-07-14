import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="
        resume-card
        animate-in
        fade-in
        duration-1000
        bg-white
        border
        border-slate-200
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl

        dark:bg-slate-800
        dark:border-slate-700
        dark:shadow-black/40
      "
    >
      {/* Header */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName ? (
            <h2 className="font-bold break-words text-black dark:text-white">
              {companyName}
            </h2>
          ) : (
            !jobTitle && (
              <h2 className="font-bold text-black dark:text-white">
                Resume
              </h2>
            )
          )}

          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500 dark:text-gray-400">
              {jobTitle}
            </h3>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* Resume Preview */}
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 rounded-xl dark:bg-slate-700">
          <div
            className="
              overflow-hidden
              rounded-lg
              border
              border-slate-200
              bg-white

              dark:border-slate-600
            "
          >
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;