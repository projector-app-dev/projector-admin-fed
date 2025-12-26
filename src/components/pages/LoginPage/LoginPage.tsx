import LockIcon from "@mui/icons-material/Lock";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import type { ErrorType } from "../../../services/common.type";
import {
  generateFirebaseAuthErrorMessage,
  signIn,
} from "../../../services/authorization.service";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAuthContext } from "../../../contexts/AuthContext/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorType | null>(null);
  const { setUser, setLoading } = useAuthContext();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    setError(null);

    signIn(email, password, setError).then((user) => {
      if (user) {
        setUser(user);

        setPassword("");
        setEmail("");
        navigate("/", { replace:  true });
      }
    });

    setLoading(false)
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ mt: 8, p: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Вхід
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={onSubmit}>
          <TextField
            placeholder="Email"
            fullWidth
            autoFocus
            required
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            placeholder="Password"
            fullWidth
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {generateFirebaseAuthErrorMessage(error)}
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Увійти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
