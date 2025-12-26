import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../contexts/AuthContext/AuthContext";
import Box from "@mui/material/Box";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    });
    return unsubscribe
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "60%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, setUser, setLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
