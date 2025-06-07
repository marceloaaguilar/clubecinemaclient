
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<RequestResponse>;
  logout: () => void;
  isLoading: boolean;
  verifyToken: () => void;
}

interface RequestResponse {
  success: boolean;
  error? : string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (email: string, password: string): Promise< RequestResponse> => {

    setIsLoading(true);

    try {
      const response = await fetch( `${import.meta.env.VITE_SERVER_URL}/user/login`,{
        method: "POST",
        body: JSON.stringify({"email": email, "password": password}),
        headers: {"Content-Type": "application/json"},
        credentials: "include",
      })
      
      let result = await response.json();
      setIsLoading(false);

      if (!result.error && response.status === 200) {
        return {success: true};
      }

    } catch(error) {

      return {success: false, error: error.message};

    } finally {
      setIsLoading(false);
    }

  };

  const logout = async () => {

    await fetch(`${import.meta.env.VITE_SERVER_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      console.log(res);

      if (res.status === 200) {
        setUser(null);
      }

    })
    .catch((error) => {
      console.error(error);

    }).finally(() => setIsLoading(false));

  };

  const verifyToken = async () => {
     fetch(`${import.meta.env.VITE_SERVER_URL}/user/verify-token`, {
      method: "GET",
      credentials: "include",
    }).then(async (res) => {

      if (res.ok) {

        const data = await res.json();
        const {id, name, email} = data.user;

        setUser({
          id: id,
          name: name,
          email: email,
        });
      }

      })
    .catch((error) => {
      setUser(null);
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
