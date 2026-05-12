import { useState, useLayoutEffect } from "react";
import { Home, Tag, Hammer, LogIn, Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { authStore } from "../lib/authStore";
import { clearSessionData } from "../lib/useSessionStorage";

type IProps = {
  tab: string;
};

const Navigation = (props: IProps) => {
  const router = useRouter();
  const storeUser = useStore(authStore, s => s.user);

  // Server renders with showUserUI=false (no avatar, no Log In button — neutral state).
  // useLayoutEffect fires before the browser's first paint and sets the real value,
  // so the user never sees the "Log In" button if they are already signed in.
  const [showUserUI, setShowUserUI] = useState<'pending' | 'logged-in' | 'logged-out'>('pending');
  useLayoutEffect(() => {
    setShowUserUI(storeUser ? 'logged-in' : 'logged-out');
  }, [storeUser]);

  // Keep a stable user ref for display — only update when we have a real user
  const [user, setUser] = useState<any>(null);
  useLayoutEffect(() => {
    if (storeUser) setUser(storeUser);
    else setUser(null);
  }, [storeUser]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(props.tab);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    { name: "Pricing", icon: <Tag size={18} />, href: "/pricing-checkout" },
    { name: "Builder", icon: <Hammer size={18} />, href: "/builder" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setIsDropdownOpen(false);

      if (user?.id) {
        clearSessionData(user.id);
      }

      const { supabase } = await import("../lib/supabase");
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      // authStore is updated by the onAuthStateChange listener in __root.tsx
      setIsLoading(false);
      await router.navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  const getAvatarInitials = () => {
    let firstName = user?.user_metadata?.firstName || '';
    let lastName = user?.user_metadata?.lastName || '';
    
    // If no separate firstName/lastName but has name (from Google OAuth), parse it
    if (!firstName && !lastName && user?.user_metadata?.name) {
      const nameParts = user.user_metadata.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    let firstName = user?.user_metadata?.firstName || '';
    let lastName = user?.user_metadata?.lastName || '';
    
    // If no separate firstName/lastName but has name (from Google OAuth), parse it
    if (!firstName && !lastName && user?.user_metadata?.name) {
      const nameParts = user.user_metadata.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return 'User';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <a href="/" onClick={() => setActiveTab("Home")} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/main_logo.svg" alt="Build My Cakes" className="h-8" />
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
            {showUserUI === 'logged-in' ? (
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
                        <p className="text-sm font-medium text-slate-900">{getDisplayName()}</p>
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
              ) : showUserUI === 'logged-out' ? (
                // Log In Button
                <a
                  href="/log-in"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 ml-4"
                >
                  <LogIn size={18} />
                  Log In
                </a>
              ) : (
                // pending — reserve space so the nav doesn't shift
                <div className="w-10 h-10 ml-4" />
              )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {showUserUI === 'logged-in' && (
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
            <p className="text-sm font-medium text-slate-900">{getDisplayName()}</p>
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
