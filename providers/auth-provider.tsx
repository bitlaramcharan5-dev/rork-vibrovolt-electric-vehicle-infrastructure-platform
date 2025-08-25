import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    if (email === "demo@vibrovolt.com" && password === "demo123") {
      const mockUser: User = {
        id: "1",
        name: "Demo User",
        email: "demo@vibrovolt.com",
        phone: "+91 98765 43210",
      };
      setUser(mockUser);
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error("Invalid credentials");
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  }, [user]);

  return useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, isLoading, login, logout, updateUser]);
});