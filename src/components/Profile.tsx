import { useEffect, useState } from "react";
import { Mail, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { supabase } = await import("../lib/supabase");
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation tab="Profile" />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation tab="Profile" />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <p className="text-slate-600">Please log in to view your profile</p>
            <button
              onClick={() => router.navigate({ to: '/log-in' })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-900">
      <Navigation tab="Profile" />

      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        {/* Profile Card */}
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.navigate({ to: '/' })}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
              <div className="w-6" />
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
                {user?.user_metadata?.firstName?.[0]}
                {user?.user_metadata?.lastName?.[0]}
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-slate-900">
                  {user?.user_metadata?.firstName} {user?.user_metadata?.lastName}
                </p>
                <p className="text-sm text-slate-500">Profile</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Mail size={18} className="text-slate-400" />
                  <p className="text-slate-700">{user?.email}</p>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Location</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <MapPin size={18} className="text-slate-400" />
                  <p className="text-slate-700">{user?.user_metadata?.location || 'Not specified'}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">User ID</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700 text-xs font-mono break-all">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium">Account created:</span>{' '}
                {new Date(user?.created_at).toLocaleDateString()}
              </p>
              {user?.last_sign_in_at && (
                <p>
                  <span className="font-medium">Last sign in:</span>{' '}
                  {new Date(user.last_sign_in_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
