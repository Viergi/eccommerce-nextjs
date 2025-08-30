import { useState, useEffect } from "react";

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
  };

  return {
    token,
    saveToken,
    removeToken,
  };
};
