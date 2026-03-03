import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useVirtualKeyboard, setUseVirtualKeyboard] = useState(false);

  const API = import.meta.env.VITE_AUTH_URL;

const  handleLogin = async (e) => {
  e.preventDefault();

  console.log("Login button clicked", form);

  if (!form.username || !form.password) {
    setError("Please enter your Customer ID and Password.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${API}/api/auth/login`, form);


    // Save data immediately
    localStorage.setItem("username", form.username);
    localStorage.setItem(`${form.username}-role`, res.data.role);

    login(res.data.token);

    // optional delay (UX only)
    setTimeout(() => {
      navigate("/");
    }, 500);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    console.error("BACKEND MESSAGE:", err.response?.data);

    setError(
      err.response?.data?.message ||
      "Authentication failed. Please check your credentials."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
     

      <div className="flex-1 flex flex-col md:flex-row items-stretch">
        
        {/* 2. Left Side: Security Awareness (Classic Bank Style) */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/3 bg-blue-900 text-white p-12 flex-col justify-center relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            alt="Security Background"
          />
          
          <div className="relative z-10 space-y-8">
            <div className="border-l-4 border-yellow-400 pl-6">
              <h1 className="text-3xl font-bold mb-2">Welcome to NetBanking</h1>
              <p className="text-blue-200">Secure access to your world of banking.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-shield-alt text-yellow-400 text-2xl"></i>
                <h3 className="font-bold text-lg">Security Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-100">
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  Ensure URL starts with 'https://'
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  Never share OTP/PIN with anyone.
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  Change your password periodically.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
                <h2 className="text-lg font-bold text-gray-800">Login to NetBanking</h2>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex gap-2 items-start">
                    <i className="fas fa-exclamation-triangle mt-0.5"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  
                  {/* Customer ID */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer ID / User ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="Enter Customer ID"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        autoFocus
                      />
                      <i className="fas fa-user absolute left-3.5 top-3.5 text-gray-400"></i>
                    </div>
                    <a href="#" className="text-xs text-blue-600 hover:underline mt-1 block">Forgot Customer ID?</a>
                  </div>

                  {/* Password / IPIN */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password / IPIN</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                      <i className="fas fa-lock absolute left-3.5 top-3.5 text-gray-400"></i>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                       <a href="#" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
                       <button 
                         type="button" 
                         className={`text-xs flex items-center gap-1 ${useVirtualKeyboard ? 'text-blue-700 font-bold' : 'text-gray-500'}`}
                         onClick={() => setUseVirtualKeyboard(!useVirtualKeyboard)}
                       >
                         <i className="fas fa-keyboard"></i> Virtual Keyboard
                       </button>
                    </div>
                  </div>

                  {/* Virtual Keyboard Placeholder (Visual Only) */}
                  {useVirtualKeyboard && (
                    <div className="mb-6 p-2 bg-gray-100 border border-gray-300 rounded text-center text-xs text-gray-500 animate-fade-in">
                      [Virtual Keyboard Interface Would Appear Here]
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-md transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
                    disabled={loading || !form.username || !form.password}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin"></i> Securely Logging In...
                      </>
                    ) : (
                      "LOGIN"
                    )}
                  </button>

                </form>
              </div>

              {/* Footer of Card */}
              <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">
                  New to Samarth Bank?{" "}
                  <Link to="/signup" className="text-blue-700 font-bold hover:underline">
                    Register Now
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex justify-center items-center gap-6 opacity-60">
              <div className="flex flex-col items-center">
                <i className="fas fa-shield-virus text-2xl text-gray-600"></i>
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Norton Secured</span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <i className="fas fa-fingerprint text-2xl text-gray-600"></i>
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">256-bit Encrypted</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}