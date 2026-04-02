import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, User, MapPin, ChevronDown } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Navigation from './Navigation';
import Footer from './Footer';
import { useRouter } from '@tanstack/react-router';
import { registerUser, registerGoogleUser } from '../server/auth.functions';

export default function App() {
  return <SignUp />;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate live password strength
  const passwordLength = formData.password.length;
  let strengthLabel = '';
  let strengthColor = '';

  const hasCapital = /[A-Z]/.test(formData.password);
  const hasNumberOrSymbol = /[\d\W_]/.test(formData.password);

  // Form validation logic
  const isAllFieldsFilled = Object.values(formData).every(val => val.trim() !== '');
  const isPasswordValid = passwordLength >= 8 && hasCapital && hasNumberOrSymbol;
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const canSubmit = isAllFieldsFilled && isPasswordValid && isPasswordMatch;

  if (passwordLength > 0) {
    if (passwordLength < 8) {
      strengthLabel = 'Weak';
      strengthColor = 'text-red-500';
    } else if (passwordLength <= 15) {
      strengthLabel = 'Medium';
      strengthColor = 'text-yellow-500';
    } else {
      strengthLabel = 'Strong';
      strengthColor = 'text-green-500';
    }
  }

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call server function to register user
      const result = await registerUser({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          location: formData.location,
        },
      });

      // Show success message
      setError('');
      console.log('Registration successful:', result.message);
      
      // Redirect to activation instructions page after successful registration
      const encodedEmail = encodeURIComponent(formData.email);
      window.location.assign(`/check-email?email=${encodedEmail}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError('');

      const token = credentialResponse.credential;

      // Call server function to register with Google
      const result = await registerGoogleUser({
        data: {
          googleToken: token,
        },
      });

      console.log('Google registration successful:', result.message);

      // Redirect to login page after successful registration
      await router.navigate({ to: '/log-in' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-Up failed. Please try again.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navigation tab="Sign Up" />

      {/* Main Content */}
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        {/* Sign Up Card */}
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Create an Account</h1>
              <p className="text-slate-600">Join Build My Cakes to start designing</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Name Fields (Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-800">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-800">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold text-slate-800">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${!formData.location ? 'text-slate-400' : 'text-slate-900'}`}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select your country</option>
                    <option value="Not Specified">Not Specified</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Password Fields (Row on larger screens, stacked on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Live Password Strength Indicator */}
                  {passwordLength > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className={`text-xs font-semibold pl-1 transition-colors duration-300 ${strengthColor}`}>
                        Password strength: {strengthLabel}
                      </p>
                      <p className={`text-xs font-semibold pl-1 transition-colors duration-300 ${hasCapital ? 'text-green-500' : 'text-red-500'}`}>
                        At least one capital letter
                      </p>
                      <p className={`text-xs font-semibold pl-1 transition-colors duration-300 ${hasNumberOrSymbol ? 'text-green-500' : 'text-red-500'}`}>
                        Contains a number or symbol (e.g., #, ?, !, %)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Live Password Match Indicator */}
                  {formData.confirmPassword.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className={`text-xs font-semibold pl-1 transition-colors duration-300 ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        Both passwords must match
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-200 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:text-slate-100 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Google Sign-Up Button */}
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  width="100%"
                />
              </div>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
              </div>
            </div>

            {/* Log In Link */}
            <button onClick={() => router.navigate({ to: '/log-in' })} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all hover:bg-slate-50">
              Log In Instead
              <ArrowRight size={18} />
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-slate-600 hover:text-blue-600 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-slate-600 hover:text-blue-600 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};