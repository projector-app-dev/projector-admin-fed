import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import { generateFirebaseAuthErrorMessage } from "../../../../services/authorization.service";
import type { ErrorType } from "../../../../services/common.type";
import { addUserDocument } from "../../../../services/user.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";

const AddUserPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(false);
  const [creationError, setCreationError] = useState<ErrorType | null>(null);
  const { setLoading } = useAppContext();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <DocumentTemplate
      title="Додавання нового користувача"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (name && phone && email && password) {
          addUserDocument(
            {
              name,
              phone,
              email,
              id: "",
            },
            password,
            setCreationError
          ).then((id) => {
            if (id) {
              navigate("/users/all", { replace: true });
            }
          });
        } else {
          setError(true);
        }

        setLoading(false);
      }}
    >
      <>
        <TextField
          label={"ПІБ"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setName(e.target.value);
            }
          }}
        />
        <TextField
          label={"Мобільний"}
          fullWidth
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setPhone(e.target.value);
            }
          }}
        />
        <TextField
          label={"Емейл"}
          fullWidth
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setCreationError(null);
              setEmail(e.target.value);
            }
          }}
        />
        <FormControl sx={{ mb: 2}} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => {
              if (e.target.value || e.target.value === "") {
                setError(false);
                setCreationError(null);
                setPassword(e.target.value);
              }
            }}
            required
            error={error}
            label="Пароль"
          />
        </FormControl>
        {creationError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {generateFirebaseAuthErrorMessage(creationError)}
          </Alert>
        )}
      </>
    </DocumentTemplate>
  );
};

export default AddUserPage;
