import { createContext, useContext } from "react";
import type { AuthContextType } from "./AuthContext.type";
import { auth } from "../../config/firebase";

export const AuthContext = createContext<AuthContextType>({
  user: auth.currentUser,
  loading: false,
  setUser: () => {},
  setLoading: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContext;
