import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUser } from "../../slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = token || localStorage.getItem("accessToken");
        const storedUser = user || JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          setName(storedUser.name || "");
          setEmail(storedUser.email || "");
          setLoading(false);
          return;
        }

        if (!storedToken) {
          console.warn("⚠ No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:8080/user/auth/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        dispatch(setUser({ ...res.data, token: storedToken }));
        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("❌ Failed to fetch profile", err);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, token, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedToken = token || localStorage.getItem("accessToken");

      const res = await axios.put(
        "http://localhost:8080/user/auth/update-profile",
        { name, email },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      setMessage(res.data.message || "✅ Profile updated successfully");

      dispatch(setUser({ ...res.data.user, token: storedToken }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data.user, token: storedToken })
      );
    } catch (err) {
      console.error("❌ Update failed", err);
      setMessage("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-24 border border-gray-500 rounded shadow">
      <h2 className="text-xl font-bold font-ubuntu mb-4 text-center">
        Update Profile
      </h2>

      {loading && !name && !email ? (
        <p className="text-center">Loading profile...</p>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4 font-ubuntu">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              className="w-full p-2 border rounded-sm text-sm"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full p-2 border rounded-sm text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded-sm w-20 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      )}

      {message && (
        <p
          className={`mt-4 font-ubuntu text-center ${
            message.toLowerCase().includes("failed")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
