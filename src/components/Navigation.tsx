import { useState, useEffect } from "react";
import { Home, Tag, Hammer, LogIn, Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

type IProps = {
  tab: string;
};

const Navigation = (props: IProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(props.tab);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        const { supabase } = await import("../lib/supabase");
        
        // Set up auth state listener - this updates user state automatically
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user || null);
          }
        );
        
        // Check current session (initial load)
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        unsubscribe = () => subscription?.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    { name: "Pricing", icon: <Tag size={18} />, href: "/pricing-checkout" },
    { name: "Builder", icon: <Hammer size={18} />, href: "/builder" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setIsDropdownOpen(false);

      // Import Supabase dynamically on the client side
      const { supabase } = await import("../lib/supabase");

      // Call Supabase signOut directly
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      console.log('Logged out successfully');

      // Reset user state and loading state
      setUser(null);
      setIsLoading(false);

      // Redirect to home
      await router.navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  const getAvatarInitials = () => {
    if (user?.user_metadata?.firstName && user?.user_metadata?.lastName) {
      return `${user.user_metadata.firstName[0]}${user.user_metadata.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <a href="/" onClick={() => setActiveTab("Home")} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white w-5 h-5"
              >
                <rect x="4" y="17" width="16" height="5" rx="1" />
                <rect x="7" y="12" width="10" height="5" rx="1" />
                <rect x="10" y="7" width="4" height="5" rx="1" />
                <path d="M12 3v4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Build My Cakes</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === item.name ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.name}
              </a>
            ))}

            {/* Avatar or Log In Button */}
            {user ? (
                // Avatar Dropdown
                <div className="relative ml-4">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold hover:shadow-lg transition-shadow"
                  >
                    {getAvatarInitials()}
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user?.user_metadata?.firstName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            router.navigate({ to: '/profile' });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <User size={16} />
                          Profile
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            router.navigate({ to: '/subscription' });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <CreditCard size={16} />
                          Subscription
                        </button>

                        <button
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <LogOut size={16} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Log In Button
                <a
                  href="/log-in"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 ml-4"
                >
                  <LogIn size={18} />
                  Log In
                </a>
              )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm"
              >
                {getAvatarInitials()}
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Avatar Dropdown */}
      {isDropdownOpen && user && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in fade-in duration-200">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">{user?.user_metadata?.firstName || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                router.navigate({ to: '/profile' });
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <User size={16} />
              Profile
            </button>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                router.navigate({ to: '/subscription' });
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <CreditCard size={16} />
              Subscription
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeTab === item.name ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.icon}
                {item.name}
              </a>
            ))}
            {!user && (
              <div className="pt-4 px-4">
                <a href="/log-in" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 text-center block">
                  Log In
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
