import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { supabase } from '../lib/supabase';

const SignUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  location: z.string().optional(),
});

export const registerUser = createServerFn({ method: 'POST' })
  .inputValidator(SignUpSchema)
  .handler(async ({ data }) => {
    try {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location || '',
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      return {
        success: true,
        userId: authData.user.id,
        email: authData.user.email,
        message: 'Account created successfully! Please check your email to confirm your account.',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      throw new Error(errorMessage);
    }
  });

const GoogleSignUpSchema = z.object({
  googleToken: z.string().min(1, 'Google token is required'),
});

export const registerGoogleUser = createServerFn({ method: 'POST' })
  .inputValidator(GoogleSignUpSchema)
  .handler(async ({ data }) => {
    try {
      // Verify the Google ID token using Google's public keys
      const { OAuth2Client } = await import('google-auth-library');
      const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) throw new Error('Google client ID not configured');

      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: data.googleToken,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid Google token');

      const email = payload.email;
      const name = payload.name || '';
      const [firstName = '', lastName = ''] = name.split(' ');

      if (!email) {
        throw new Error('Could not retrieve email from Google account');
      }

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser?.users?.some(
        (user) => user.email === email
      );

      if (userExists) {
        // User already exists, they should sign in instead
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-12), // Generate random password for OAuth users
        options: {
          data: {
            firstName,
            lastName,
            location: '',
            googleId: payload.sub,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      return {
        success: true,
        userId: authData.user.id,
        email: authData.user.email,
        message: 'Account created successfully with Google!',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google registration failed';
      throw new Error(errorMessage);
    }
  });

export const logoutUser = createServerFn({ method: 'POST' })
  .handler(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      throw new Error(errorMessage);
    }
  });

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const loginUser = createServerFn({ method: 'POST' })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Login failed');
      }

      return {
        success: true,
        userId: authData.user.id,
        email: authData.user.email,
        message: 'Logged in successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  });

export const loginGoogleUser = createServerFn({ method: 'POST' })
  .inputValidator(GoogleSignUpSchema)
  .handler(async ({ data }) => {
    try {
      // Verify the Google ID token using Google's public keys before trusting it
      const { OAuth2Client } = await import('google-auth-library');
      const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) throw new Error('Google client ID not configured');

      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: data.googleToken,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid Google token');

      // Use Supabase's built-in Google ID token sign-in (creates session server-side)
      const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: data.googleToken,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Google login failed');
      }

      return {
        success: true,
        userId: authData.user.id,
        email: authData.user.email,
        message: 'Logged in with Google successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      throw new Error(errorMessage);
    }
  });
