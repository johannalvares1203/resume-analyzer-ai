import { useEffect, useRef, useState } from "react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { getNames } from "country-list";
import { usePuterStore } from "~/lib/puter";

import {
  Camera,
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Globe,
  Save,
  Link,
  X,
} from "lucide-react";

const COUNTRIES = getNames().sort();

const Profile = () => {
  const { auth, kv } = usePuterStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] =
    useState<string>("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: auth.user?.username || "",
    email: "",
    age: "",
    sex: "",
    dob: "",
    phone: "",
    address: "",
    country: "",
    linkedIn: "",
    github: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await kv.get("user-profile");

      if (!saved) return;

      const profile = JSON.parse(saved);

      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: auth.user?.username || "",
        email: "",
        age: profile.age || "",
        sex: profile.sex || "",
        dob: profile.dob || "",
        phone: profile.phone || "",
        address: profile.address || "",
        country: profile.country || "",
        linkedIn: profile.linkedIn || "",
        github: profile.github || "",
      });

      setProfileImage(profile.profileImage || "");
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.firstName.trim())
      e.firstName = "First name is required.";

    if (!form.lastName.trim())
      e.lastName = "Last name is required.";

    if (!form.phone.trim())
      e.phone = "Phone number is required.";

    if (
      form.linkedIn &&
      !form.linkedIn.startsWith("https://")
    ) {
      e.linkedIn =
        "LinkedIn must start with https://";
    }

    if (
        form.github &&
        !form.github.startsWith("https://")
      ) {
        e.github =
          "GitHub must start with https://";
      }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await kv.set(
        "user-profile",
        JSON.stringify({
          ...form,
          profileImage,
        })
      );

      alert("Profile saved successfully.");
    } finally {
      setLoading(false);
    }
  };

  const cancelChanges = () => {
    loadProfile();
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
  
    const birthDate = new Date(dob);
    const today = new Date();
  
    let age =
      today.getFullYear() -
      birthDate.getFullYear();
  
    const month =
      today.getMonth() -
      birthDate.getMonth();
  
    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--;
    }
  
    return age.toString();
  };

  return (
    <>
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-slate-100 dark:bg-slate-950">
        <Navbar />
  
        <section className="mx-auto max-w-7xl px-6 py-14">
  
          {/* Header */}
  
          <div className="mb-12">
  
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white">
              My Profile
            </h1>
  
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              Manage your personal information and account details.
            </p>
  
          </div>
  
          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
  
            {/* Left Card */}
  
            <div
              className="
                rounded-3xl
                border
                border-white/20
                bg-white/70
                p-8
                shadow-2xl
                backdrop-blur-xl
                dark:border-slate-700
                dark:bg-slate-900/70
              "
            >
  
              <div className="flex flex-col items-center">
  
                <div className="relative">
  
                  <div
                    className="
                      h-40
                      w-40
                      overflow-hidden
                      rounded-full
                      border-4
                      border-white
                      shadow-xl
                    "
                  >
  
                    {profileImage ? (
  
                      <img
                        src={profileImage}
                        className="h-full w-full object-cover"
                      />
  
                    ) : (
  
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          bg-gradient-to-r
                          from-indigo-500
                          to-purple-600
                          text-white
                        "
                      >
                        <User size={70} />
                      </div>
  
                    )}
  
                  </div>
  
                  <button
                    onClick={uploadImage}
                    className="
                      absolute
                      bottom-2
                      right-2
                      rounded-full
                      bg-indigo-600
                      p-3
                      text-white
                      shadow-xl
                      transition
                      hover:scale-110
                    "
                  >
                    <Camera size={18} />
                  </button>
  
                </div>
  
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handleImage}
                />
  
                <h2 className="mt-6 text-2xl font-bold dark:text-white">
                  {form.firstName || "First Name"}{" "}
                  {form.lastName}
                </h2>
  
                <p className="mt-2 text-slate-500">
                  @{form.username}
                </p>
  
                <div
                  className="
                    mt-6
                    rounded-full
                    bg-green-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-green-700
                    dark:bg-green-900/30
                    dark:text-green-300
                  "
                >
                  ✓ Connected with Puter
                </div>
  
              </div>
  
            </div>
  
            {/* Right Card */}
  
            <div
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              p-3
              text-slate-900
              placeholder:text-slate-400
              transition
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-200
              focus:outline-none
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-500
              dark:focus:ring-indigo-900
              "
            >
  
              <h2 className="mb-8 text-2xl font-bold dark:text-white">
                Personal Information
              </h2>
  
              <div className="grid gap-6 md:grid-cols-2">
  
                {/* First Name */}
  
                <div>
  
                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    First Name
                  </label>
  
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      handleChange(
                        "firstName",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border p-3 dark:bg-slate-800"
                  />
  
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
  
                </div>
  
                {/* Last Name */}
  
                <div>
  
                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    Last Name
                  </label>
  
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      handleChange(
                        "lastName",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border p-3 dark:bg-slate-800"
                  />
  
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
  
                </div>
  
                {/* Username */}
  
                <div>
  
                 <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    Username
                  </label>
  
                  <div className="relative">
  
                    <User
                      size={18}
                      className="absolute left-3 top-4 text-slate-400"
                    />
  
                    <input
                      value={form.username}
                      readOnly
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                    />
  
                  </div>
  
                </div>
  
                {/* Email */}
  
                <div>
  
                 <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    Email
                  </label>
  
                  <div className="relative">
  
                    <Mail
                      size={18}
                      className="absolute left-3 top-4 text-slate-400"
                    />
  
                    <input
                      value={form.email}
                      readOnly
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                    />
  
                  </div>
  
                </div>

            

              {/* Sex */}

              <div>
               <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  Sex
                </label>

                <select
                  value={form.sex}
                  onChange={(e) =>
                    handleChange("sex", e.target.value)
                  }
                  className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>

                </select>
              </div>

              {/* Date of Birth */}

              <div>

               <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  Date of Birth
                </label>

                <div className="relative">

                  <Calendar
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => {
                        const dob = e.target.value;
                      
                        setForm((prev) => ({
                          ...prev,
                          dob,
                          age: calculateAge(dob),
                        }));
                      }}
                      className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      p-3
                      text-slate-900
                      placeholder:text-slate-400
                      transition
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-200
                      focus:outline-none
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:placeholder:text-slate-500
                      dark:focus:ring-indigo-900
                      "
                  />

                </div>

              </div>

              <div>
               <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    Age
                </label>

                <input
                    readOnly
                    value={form.age}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                />
            </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  Phone
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    placeholder="+91 9876543210"
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                  />

                </div>

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phone}
                  </p>
                )}

              </div>

              {/* Address */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(e) =>
                      handleChange(
                        "address",
                        e.target.value
                      )
                    }
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                  />

                </div>

              </div>

              {/* Country */}

              <div>

                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  Country
                </label>

                <div className="relative">

                  <Globe
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <select
                    value={form.country}
                    onChange={(e) =>
                      handleChange(
                        "country",
                        e.target.value
                      )
                    }
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                  >
                    <option value="">
                      Select Country
                    </option>

                    {COUNTRIES.map((country) => (
                      <option
                        key={country}
                        value={country}
                      >
                        {country}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              {/* GitHub */}

                    <div>

                    <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                    GitHub
                    </label>

                    <div className="relative">

                    <Link
                        size={18}
                        className="absolute left-3 top-4 text-slate-400"
                    />

                    <input
                        value={form.github}
                        onChange={(e) =>
                        handleChange(
                            "github",
                            e.target.value
                        )
                        }
                        placeholder="https://github.com/username"
                        className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                    />

                    </div>

                    {errors.github && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.github}
                    </p>
                    )}

                    </div>

              {/* LinkedIn */}

              <div>

                <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
                  LinkedIn
                </label>

                <div className="relative">

                  <Link
                    size={18}
                    className="absolute left-3 top-4 text-slate-400"
                  />

                  <input
                    value={form.linkedIn}
                    onChange={(e) =>
                      handleChange(
                        "linkedIn",
                        e.target.value
                      )
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        p-3
                        text-slate-900
                        placeholder:text-slate-400
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-200
                        focus:outline-none
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:ring-indigo-900
                        "
                  />

                </div>

                {errors.linkedIn && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.linkedIn}
                  </p>
                )}

              </div>

            </div>




                        {/* Action Buttons */}

                        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-slate-200 pt-8 dark:border-slate-700 sm:flex-row sm:justify-end">

<button
  onClick={cancelChanges}
  className="
    flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    border
    border-slate-300
    bg-white
    px-8
    py-4
    font-semibold
    text-slate-700
    shadow-sm
    transition-all
    duration-200
    hover:bg-slate-100
    dark:border-slate-700
    dark:bg-slate-800
    dark:text-white
    dark:hover:bg-slate-700
  "
>
  <X size={18} />
  Cancel
</button>

<button
  onClick={saveProfile}
  disabled={loading}
  className="
    flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    bg-gradient-to-r
    from-indigo-500
    to-purple-600
    px-8
    py-4
    font-semibold
    text-white
    shadow-xl
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-indigo-500/30
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  <Save size={18} />

  {loading ? "Saving..." : "Save Changes"}
</button>

</div>

</div>

</div>

{/* Profile Completion */}

<div
className="
mt-10
rounded-3xl
border
border-white/20
bg-white/70
p-8
shadow-xl
backdrop-blur-xl
dark:border-slate-700
dark:bg-slate-900/70
"
>

<h3 className="mb-5 text-xl font-bold dark:text-white">
Profile Completion
</h3>

{(() => {
const fields = [
form.firstName,
form.lastName,
form.phone,
form.address,
form.country,
form.linkedIn,
form.age,
form.sex,
form.dob,
profileImage,
];

const completed = fields.filter(Boolean).length;

const percent = Math.round(
(completed / fields.length) * 100
);

const calculateAge = (dob: string) => {
    if (!dob) return "";
  
    const birthDate = new Date(dob);
    const today = new Date();
  
    let age =
      today.getFullYear() -
      birthDate.getFullYear();
  
    const month =
      today.getMonth() -
      birthDate.getMonth();
  
    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--;
    }
  
    return age.toString();
  };

return (
<>
  <div className="mb-4 h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700"
      style={{
        width: `${percent}%`,
      }}
    />

  </div>

  <div className="flex items-center justify-between">

    <p className="font-medium text-slate-600 dark:text-slate-300">
      {percent}% Complete
    </p>

    <p className="text-sm text-slate-500">
      Complete your profile for a better experience.
    </p>

  </div>
</>
);
})()}

</div>

</section>

<Footer />

</main>
</>
);
};

export default Profile;