import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield,
  HardDrive,
  Trash2,
  User,
  FileText,
  Image,
  Database,
} from "lucide-react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const {
    auth,
    isLoading,
    error,
    fs,
    kv,
  } = usePuterStore();

  const navigate = useNavigate();

  const [files, setFiles] = useState<FSItem[]>([]);
  const [deleting, setDeleting] = useState(false);

  const loadFiles = async () => {
    const result = (await fs.readDir("./")) as FSItem[];

    if (result) {
      setFiles(result);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated]);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await Promise.all(
        files.map((file) => fs.delete(file.path))
      );

      await kv.flush();

      await loadFiles();
    } finally {
      setDeleting(false);
    }
  };

  const pdfCount = useMemo(
    () =>
      files.filter((f) =>
        f.name.toLowerCase().endsWith(".pdf")
      ).length,
    [files]
  );

  const imageCount = useMemo(
    () =>
      files.filter((f) =>
        /\.(png|jpg|jpeg|webp)$/i.test(f.name)
      ).length,
    [files]
  );

  const totalFiles = files.length;

  const getIcon = (name: string) => {
    if (name.endsWith(".pdf")) {
      return (
        <FileText
          size={22}
          className="text-red-500"
        />
      );
    }

    if (
      /\.(png|jpg|jpeg|webp)$/i.test(name)
    ) {
      return (
        <Image
          size={22}
          className="text-indigo-500"
        />
      );
    }

    return (
      <Database
        size={22}
        className="text-gray-500"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black">
  
        <Navbar />
  
        {/* Hero */}
      <section className="mx-auto max-w-7xl px-8 pt-16">
  
        <div className="mb-10 flex items-center justify-between">
  
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Shield size={16} />
              Storage Management
            </div>
  
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              App Storage
            </h1>
  
            <p className="mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Manage all uploaded resumes, generated assets and
              application data stored in your AI Resume Analyzer
              workspace.
            </p>
          </div>
  
          <div className="hidden rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900 lg:block">
  
            <div className="mb-5 flex items-center gap-4">
  
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <User size={26} />
              </div>
  
              <div>
                <p className="text-sm text-slate-500">
                  Logged in as
                </p>
  
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {auth.user?.username}
                </h3>
              </div>
  
            </div>
  
            <div className="rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
              ✓ Workspace Connected
            </div>
  
          </div>
  
        </div>
  
        {/* Statistics */}
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  
          <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900">
  
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
              <HardDrive
                className="text-indigo-600"
                size={28}
              />
            </div>
  
            <p className="text-slate-500">
              Total Files
            </p>
  
            <h2 className="mt-2 text-5xl font-bold dark:text-white">
              {totalFiles}
            </h2>
  
          </div>
  
          <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900">
  
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <FileText
                size={28}
                className="text-red-500"
              />
            </div>
  
            <p className="text-slate-500">
              PDF Files
            </p>
  
            <h2 className="mt-2 text-5xl font-bold dark:text-white">
              {pdfCount}
            </h2>
  
          </div>
  
          <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900">
  
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30">
              <Image
                size={28}
                className="text-violet-500"
              />
            </div>
  
            <p className="text-slate-500">
              Images
            </p>
  
            <h2 className="mt-2 text-5xl font-bold dark:text-white">
              {imageCount}
            </h2>
  
          </div>
  
        </div>
  
        {/* Files */}
  
        <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
  
          <div className="mb-8 flex items-center justify-between">
  
            <div>
  
              <h2 className="text-2xl font-bold dark:text-white">
                Uploaded Files
              </h2>
  
              <p className="mt-1 text-slate-500">
                Files currently stored inside your workspace.
              </p>
  
            </div>
  
            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold dark:bg-slate-800">
              {files.length} Items
            </div>
  
          </div>
  
          <div className="space-y-4">
  
            {files.length === 0 ? (
  
              <div className="rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
  
                <Database
                  size={48}
                  className="mx-auto mb-5 text-slate-400"
                />
  
                <h3 className="text-xl font-semibold dark:text-white">
                  No files found
                </h3>
  
                <p className="mt-2 text-slate-500">
                  Upload a resume to start using the application.
                </p>
  
              </div>
  
            ) : (
  
              files.map((file) => (
  
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
  
                  <div className="flex items-center gap-4">
  
                    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                      {getIcon(file.name)}
                    </div>
  
                    <div>
  
                      <h3 className="font-semibold dark:text-white">
                        {file.name}
                      </h3>
  
                      <p className="text-sm text-slate-500">
                        {file.path}
                      </p>
  
                    </div>
  
                  </div>
  
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Stored
                  </span>
  
                </div>
  
              ))
  
            )}
  
          </div>
  
        </div>


              {/* Danger Zone */}

      <div className="mt-12 mb-16 rounded-3xl border border-red-200 bg-white p-8 shadow-xl dark:border-red-900/40 dark:bg-slate-900">

<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

  <div>

    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-300">
      <Trash2 size={16} />
      Danger Zone
    </div>

    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
      Delete all application data
    </h2>

    <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
      This permanently removes every uploaded resume,
      generated image, AI analysis and all key-value
      storage associated with your account.

      <br />
      <br />

      This action cannot be undone.
    </p>

  </div>

  <button
    disabled={deleting || files.length === 0}
    onClick={() => {
      const confirmed = window.confirm(
        "Delete all uploaded files and application data?\n\nThis action cannot be undone."
      );

      if (confirmed) {
        handleDelete();
      }
    }}
    className="
      flex
      items-center
      justify-center
      gap-3
      rounded-2xl
      bg-gradient-to-r
      from-red-500
      to-rose-600
      px-8
      py-5
      text-lg
      font-semibold
      text-white
      shadow-xl
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-red-500/30
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    <Trash2 size={22} />

    {deleting
      ? "Deleting..."
      : "Wipe App Data"}
  </button>

</div>

</div>

</section>
<Footer />

</main>
);

};

export default WipeApp;