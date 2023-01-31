import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import app from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

//pri vsqka promqna na authState-a na firebase se storva novata informaciq vuv user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
//sega mojem da predadem promenlivata user na vseki komponent wrap-nat v AuthProvider-a
