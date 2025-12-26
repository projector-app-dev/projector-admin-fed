import { createContext, useContext } from "react";
import type { UserContextType } from "./UserContext.type";

export const UserContext = createContext<UserContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
});

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
