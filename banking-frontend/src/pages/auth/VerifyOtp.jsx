import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const API = import.meta.env.VITE_API_URL;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

//   const API = import.meta.env.VITE_AUTH_URL;

  const inputsRef = useRef([]);

  /* Countdown Timer */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  if (!email) {
    return (
      <p className="text-center mt-10 text-red-600 font-bold">
        Invalid Access
      </p>
    );
  }

  /* Handle OTP Change */
  const handleChange = (index, value) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* Handle Backspace */
  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* Submit */
  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "/api/auth/otp",
        null,
        {
          params: {
            email,
            otp: finalOtp
          }
        }
      );

  // for development, use the full URL to avoid CORS issues. In production, the relative URL will work fine.
//    await axios.post(
//         `${API}/api/auth/otp`,
//         null,
//         {
//           params: {
//             email,
//             otp: finalOtp
//           }
//         }
//       );
      toast.success("Registration Successful 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      toast.error(
        err.response?.data || "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  /* Resend OTP */
  const resendOtp = async () => {

    try {

      await axios.post("/api/auth/resend-otp", null, {
        params: { email }
      });

      setTimer(60);

      toast.success("OTP Resent Successfully");

    } catch {

      toast.error("Failed to resend OTP");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">

      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">
          Verify OTP
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Code sent to <b>{email}</b>
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-between mb-6">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e) =>
                handleKeyDown(index, e)
              }
              className="
                w-12 h-12 text-xl text-center
                border rounded-lg
                focus:ring-2 focus:ring-blue-600
                outline-none
              "
            />
          ))}

        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="
            w-full bg-blue-800 hover:bg-blue-900
            text-white py-3 rounded-lg
            font-bold transition
            disabled:opacity-60
          "
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend */}
        <div className="text-center mt-4 text-sm text-gray-600">

          {timer > 0 ? (
            <span>
              Resend in <b>{timer}s</b>
            </span>
          ) : (
            <button
              type="button"
              onClick={resendOtp}
              className="text-blue-700 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}

        </div>

      </form>
    </div>
  );
}
