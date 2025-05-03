"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// User interface
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isAuthor: boolean;
  createdAt: string;
  updatedAt: string;
}

// Author profile interface
interface AuthorProfile {
  _id: string;
  userId: string;
  preNominals?: string;
  middleInitials?: string;
  countryOfResidence: string;
  bio: string;
  links: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  authorProfile: AuthorProfile | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    redirectUrl: string | null
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/profile");

      if (!response.ok) {
        setUser(null);
        setAuthorProfile(null);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setAuthorProfile(data.authorProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
      setAuthorProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (
    email: string,
    password: string,
    redirectUrl: string | null
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);

      toast.success("Login successful!");

      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      // Redirect based on user role
      if (data.user.role === "super_admin" || data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Invalid email or password";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setAuthorProfile(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authorProfile,
        loading,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
