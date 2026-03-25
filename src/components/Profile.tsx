import { useEffect, useState } from "react";
import { Mail, MapPin, ArrowLeft, Edit2, Check, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { supabase } = await import("../lib/supabase");
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
        if (authUser) {
          let first = authUser?.user_metadata?.firstName || '';
          let last = authUser?.user_metadata?.lastName || '';
          
          // If no separate firstName/lastName but has name (from Google OAuth), parse it
          if (!first && !last && authUser?.user_metadata?.name) {
            const nameParts = authUser.user_metadata.name.split(' ');
            first = nameParts[0] || '';
            last = nameParts.slice(1).join(' ') || '';
          }
          
          setFirstName(first);
          setLastName(last);
          setLocation(authUser?.user_metadata?.location || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveName = async () => {
    try {
      setIsSaving(true);
      const { supabase } = await import("../lib/supabase");
      
      const { error } = await supabase.auth.updateUser({
        data: { firstName, lastName }
      });

      if (error) throw error;
      
      setUser({ ...user, user_metadata: { ...user?.user_metadata, firstName, lastName } });
      setEditingName(false);
      showMessage('success', 'Name updated successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    try {
      setIsSaving(true);
      const { supabase } = await import("../lib/supabase");
      
      const { error } = await supabase.auth.updateUser({
        data: { location }
      });

      if (error) throw error;
      
      setUser({ ...user, user_metadata: { ...user?.user_metadata, location } });
      setEditingLocation(false);
      showMessage('success', 'Location updated successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update location');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsSaving(true);
      const { supabase } = await import("../lib/supabase");
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingPassword(false);
      showMessage('success', 'Password changed successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdits = () => {
    setEditingName(false);
    setEditingLocation(false);
    setEditingPassword(false);
    setFirstName(user?.user_metadata?.firstName || '');
    setLastName(user?.user_metadata?.lastName || '');
    setLocation(user?.user_metadata?.location || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
                {firstName?.[0]}
                {lastName?.[0]}
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-slate-900">
                  {firstName} {lastName}
                </p>
                <p className="text-sm text-slate-500">Profile</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Message Alert */}
              {message && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Name Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Full Name</label>
                  {!editingName && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                {editingName ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-xl hover:bg-slate-300 transition-colors"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-700">{firstName} {lastName}</p>
                  </div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Mail size={18} className="text-slate-400" />
                  <p className="text-slate-700">{user?.email}</p>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Location</label>
                  {!editingLocation && (
                    <button
                      onClick={() => setEditingLocation(true)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                {editingLocation ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveLocation}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-xl hover:bg-slate-300 transition-colors"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                    <MapPin size={18} className="text-slate-400" />
                    <p className="text-slate-700">{location || 'Not specified'}</p>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Password</label>
                  {!editingPassword && (
                    <button
                      onClick={() => setEditingPassword(true)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                {editingPassword ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Current Password (for verification)"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Check size={16} /> Change
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-xl hover:bg-slate-300 transition-colors"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-700">••••••••</p>
                  </div>
                )}
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
