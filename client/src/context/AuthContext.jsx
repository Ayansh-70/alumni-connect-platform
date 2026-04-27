import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUserRequest, loginRequest } from '../api/auth.js';
import { getUnreadNotificationCountRequest } from '../api/notifications.js';
import { AUTH_STORAGE_KEY } from '../utils/auth.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const applyAuthData = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);

    if (nextToken) {
      localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUnreadNotificationCount(0);
    }
  };

  const logout = () => {
    applyAuthData({ user: null, token: null });
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    try {
      const response = await getCurrentUserRequest();
      const currentUser = response.data?.user || null;

      if (!currentUser) {
        throw new Error('Unable to load your account.');
      }

      setUser(currentUser);
      setToken(storedToken);
      return currentUser;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const authenticatedUser = response.data?.user;
    const authenticatedToken = response.data?.token;

    if (!authenticatedUser || !authenticatedToken) {
      throw new Error('Authentication response is incomplete.');
    }

    applyAuthData({ user: authenticatedUser, token: authenticatedToken });
    await refreshNotificationCount();
    return authenticatedUser;
  };

  const refreshNotificationCount = async () => {
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedToken) {
      setUnreadNotificationCount(0);
      return 0;
    }

    try {
      const response = await getUnreadNotificationCountRequest();
      const nextCount = response.data?.unreadCount || 0;
      setUnreadNotificationCount(nextCount);
      return nextCount;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    checkAuth().catch(() => null);
  }, []);

  useEffect(() => {
    if (!user || !token) {
      setUnreadNotificationCount(0);
      return undefined;
    }

    refreshNotificationCount().catch(() => null);
    const intervalId = window.setInterval(() => {
      refreshNotificationCount().catch(() => null);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [user, token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    unreadNotificationCount,
    login,
    logout,
    checkAuth,
    refreshNotificationCount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};

export { AuthProvider, useAuth };
