import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('netbanking');
  const [isMobile, setIsMobile] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError(""); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload(); 
  };

  // --- AUTHENTICATED VIEW (DASHBOARD PREVIEW) ---
  if (isAuthenticated && user) {
  return (
  <section className="relative min-h-[85vh] flex items-center font-sans">
    
    {/* Background */}
    <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Bank Staff Helping Customer" 
            className="w-full h-full object-cover object-[50%_20%] sm:object-center"
            loading="eager"
          />
          {/* Light Gradient Overlay for Text Readability on Light Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent lg:bg-gradient-to-r lg:from-white/90 lg:via-white/40 lg:to-transparent"></div>
        </div>
    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* LEFT */}
        <div className="lg:col-span-8 space-y-7 text-center lg:text-left">

          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-800">
              Welcome back, {user.email} 👋
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
            Your Financial <br />
            <span className="text-yellow-500 border-b-4 border-yellow-500">
              Dashboard
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-slate-600 text-base sm:text-lg font-medium">
            Track accounts, manage loans, monitor transactions and grow your
            finances — all from one secure place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-7 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Go to Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-bold py-3 px-7 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>

    

        </div>
      </div>
    </div>
  </section>
);

}

  // --- PUBLIC VIEW (LOGIN FORM) ---
  return (
    <section className="relative min-h-[85vh] flex flex-col font-sans">
      
      {/* Main Container */}
      <div className="relative flex-1 flex items-center py-8 lg:py-0">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            // src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop"
            alt="Bank Staff Helping Customer" 
            className="w-full h-full object-cover object-[50%_20%] sm:object-center"
            loading="eager"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/80 to-transparent"></div> */}
          
          {/* Light Gradient Overlay for Text Readability on Light Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent lg:bg-gradient-to-r lg:from-white/90 lg:via-white/40 lg:to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
            
            {/* LEFT: Marketing Text (UPDATED TO DARK TEXT) */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left pt-8 lg:pt-0">
              <div className="inline-block bg-blue-100/80 backdrop-blur-md border border-blue-200 px-4 py-1 rounded-full text-sm font-bold tracking-wide text-blue-900">
                #BankingApkeSaath
              </div>
              
              {/* Changed text-white to text-slate-900 for visibility on light bg */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                Turning Your Dreams <br className="hidden sm:block" />
                Into <span className="text-yellow-500 border-b-4 border-yellow-500">Reality</span>
              </h1>
              
              {/* Changed text-blue-100 to text-slate-600 */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience India's most trusted banking partner. 
                From <strong>Instant Home Loans</strong> to <strong>Wealth Management</strong>, 
                we are here for every step of your journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 sm:px-8 rounded-lg shadow-lg transition-all active:scale-95 text-sm sm:text-base">
                  Open Savings Account
                </button>
                {/* Updated Secondary Button to Dark Blue */}
                <button className="bg-transparent border-2 border-blue-900 hover:bg-blue-900 hover:text-white text-blue-900 font-bold py-3 px-6 sm:px-8 rounded-lg transition-all text-sm sm:text-base">
                  Apply for Loan
                </button>
              </div>

              {/* Mobile Stats - Dark Text */}
              {isMobile && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300/50">
                  <div className="text-center">
                    <div className="text-blue-900 font-bold text-lg">50L+</div>
                    <div className="text-slate-600 text-xs font-semibold">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-900 font-bold text-lg">5k+</div>
                    <div className="text-slate-600 text-xs font-semibold">Branches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-900 font-bold text-lg">45+</div>
                    <div className="text-slate-600 text-xs font-semibold">Years</div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Login Widget */}
            <div className="lg:col-span-4 lg:col-start-9 mt-8 lg:mt-0 w-full max-w-md mx-auto lg:max-w-none">
              
              {/* GLASS CARD CONTAINER */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-xl shadow-2xl overflow-hidden">
                
                {/* Tabs */}
                <div className="flex text-sm font-bold border-b border-gray-300/50">
                  {['netbanking', 'creditcard'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-center transition-colors ${
                        activeTab === tab 
                          ? 'bg-blue-900 text-white' 
                          : 'bg-transparent text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      {tab === 'netbanking' ? 'NetBanking' : 'Credit Card'}
                    </button>
                  ))}
                </div>

                {/* Login Form */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-black font-bold text-lg">Welcome to NetBanking</h3>
                    <p className="text-xs text-gray-800 mt-1 font-semibold">Secure 256-bit Encryption</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg font-medium">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                      Customer ID / User ID
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-gray-300 rounded p-3 pl-10 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-black placeholder-gray-500 text-base shadow-sm font-medium"
                        placeholder="Enter Customer ID"
                      />
                      <i className="fas fa-user absolute left-3 top-3.5 text-gray-600"></i>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-gray-300 rounded p-3 pl-10 pr-10 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-black placeholder-gray-500 text-base shadow-sm font-medium"
                        placeholder="Enter Password"
                      />
                      <i className="fas fa-lock absolute left-3 top-3.5 text-gray-600"></i>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800"
                      >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogin}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 active:scale-95 shadow-lg"
                  >
                    <i className="fas fa-lock"></i> CONTINUE TO LOGIN
                  </button>

                  <div className="flex justify-between text-xs text-blue-900 font-bold">
                    <a href="#" className="hover:underline">Forgot Password?</a>
                    <a href="/signup" className="hover:underline">Register Now</a>
                  </div>

                  <div className="bg-yellow-50/80 border border-yellow-200 p-3 rounded flex gap-2 items-start shadow-sm">
                    <i className="fas fa-shield-alt text-yellow-700 mt-0.5"></i>
                    <p className="text-xs text-gray-900 leading-tight font-medium">
                      <strong>Security Tip:</strong> Never share OTP, PIN, or Password.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile App Download */}
              {isMobile && (
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-lg text-xs flex-1 justify-center transition-colors shadow-lg">
                    <i className="fab fa-google-play text-lg"></i>
                    <div className="text-left">
                      <div className="text-[10px] uppercase opacity-80">Get it on</div>
                      <div className="font-bold leading-none">Google Play</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-lg text-xs flex-1 justify-center transition-colors shadow-lg">
                    <i className="fab fa-apple text-lg"></i>
                    <div className="text-left">
                      <div className="text-[10px] uppercase opacity-80">Download on</div>
                      <div className="font-bold leading-none">App Store</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}