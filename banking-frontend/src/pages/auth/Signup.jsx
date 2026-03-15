import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "USER",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.phone || !form.password) {
      setError("Please fill in all mandatory fields marked with *");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        role: form.role.toUpperCase(),
        password: form.password,
      };
//       For development, we can use a relative URL since our proxy is set up in package.json
//       await axios.post(`${API}/api/auth/register`, payload);
await axios.post("/api/auth/register", payload);
      navigate("/verify-otp", {
      state: { email: form.email }
    });
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Please try again.");
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
    

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* 2. Left Side: Marketing / Value Prop (Visible on Desktop) */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/3 bg-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Image Overlay */}
          <img 
            src="https://tse2.mm.bing.net/th/id/OIP.DVHSfkhYFT9Un8YUes9pGwHaEY?w=1920&h=1138&rs=1&pid=ImgDetMain&o=7&rm=3" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt="Banking Lifestyle"
          />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Why Register?</h2>
            <ul className="space-y-6">
              {[
                { title: "Zero Balance Account", desc: "Open a digital savings account instantly with no minimum balance." },
                { title: "High Interest Rates", desc: "Earn up to 7% p.a. on your savings with daily interest credit." },
                { title: "Instant Virtual Card", desc: "Get a free virtual debit card for online shopping immediately." },
                { title: "24/7 Banking", desc: "Access 200+ banking services from the comfort of your home." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 border border-blue-700">
                    <i className="fas fa-check text-yellow-400 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-12">
            <div className="bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg border border-blue-700">
              <p className="text-sm italic">"The most seamless banking experience I've ever had. Highly recommended!"</p>
              <div className="mt-2 text-xs text-yellow-400 font-bold">⭐⭐⭐⭐⭐ — Rajesh K., Customer since 2020</div>
            </div>
          </div>
        </div>

        {/* 3. Right Side: The Registration Form */}
        <div className="flex-1 p-6 md:p-12 lg:px-24 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-2xl">
            
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Account Registration</h1>
              <p className="text-gray-500 mt-2">Please enter your details as per your official ID documents.</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div>
                  <h4 className="text-red-800 font-bold text-sm">Registration Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Username */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">User Name / User Id <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="username"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Rahul Sharma"
                    value={form.username}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${form.role === 'USER' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="USER" 
                        checked={form.role === 'USER'} 
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-800">Savings Account</div>
                        <div className="text-xs text-gray-500">For personal use</div>
                      </div>
                    </label>
                    <label className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${form.role === 'ADMIN' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="ADMIN" 
                        checked={form.role === 'ADMIN'} 
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-800">Current Account</div>
                        <div className="text-xs text-gray-500">For business use</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleInputChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 number.</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  />
                </div>

              </div>

              {/* Terms Checkbox */}
              <div className="mt-6 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>, <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and consent to credit checks as part of the approval process.
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i> Processing Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have a Customer ID? <Link to="/login" className="text-blue-700 font-bold hover:underline">Login to NetBanking</Link>
              </div>

            </form>

            {/* Trust Footer */}
            <div className="mt-8 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
               {/* Placeholders for Norton/McAfee logos - using FontAwesome for now */}
               <div className="flex items-center gap-1"><i className="fas fa-shield-virus text-2xl"></i> <span className="text-xs font-bold">Norton Secured</span></div>
               <div className="flex items-center gap-1"><i className="fas fa-lock text-2xl"></i> <span className="text-xs font-bold">SSL Encrypted</span></div>
               <div className="flex items-center gap-1"><i className="fas fa-certificate text-2xl"></i> <span className="text-xs font-bold">PCI DSS Compliant</span></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}