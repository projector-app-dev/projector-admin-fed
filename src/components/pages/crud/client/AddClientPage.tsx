import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import { useAuthContext } from "../../../../contexts/AuthContext/AuthContext";
import {
  addClientDocument,
  createCode,
} from "../../../../services/client.service";
import { getUserByUid } from "../../../../services/user.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import CustomDataPicker from "../../../molecules/CustomDataPicker/CustomDataPicker";
import type { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

const AddClientPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState(false);
  const [creationError, setCreationError] = useState<boolean>(false);
  const { setLoading } = useAppContext();

  return (
    <DocumentTemplate
      title="Додавання нового клієнта"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (name && surname && lastName && email && phone && birthDate) {
          if (user) {
            getUserByUid(user.uid)
              .then((currentUser) => {
                if (currentUser) {
                  addClientDocument({
                    code: createCode(name, lastName, surname, birthDate),
                    address,
                    id: "",
                    userIdCreated: currentUser.id,
                    name,
                    lastName,
                    surname,
                    phone,
                    email,
                    birthDate: Timestamp.fromDate(birthDate.toDate()),
                  })
                    .then((id) => {
                      if (id) {
                        navigate("/clients/all", { replace: true });
                      } else {
                        setCreationError(true);
                      }
                    })
                    .catch(() => setCreationError(true));
                } else {
                  setCreationError(true);
                }
              })
              .catch(() => setCreationError(true));
          } else {
            setCreationError(true);
          }
        } else {
          setError(true);
        }

        setLoading(false);
      }}
    >
      <>
        <TextField
          label={"Прізвище"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setSurname(e.target.value);
            }
          }}
        />
        <TextField
          label={"Ім`я"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setName(e.target.value);
            }
          }}
        />
        <TextField
          label={"Побатькові"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setLastName(e.target.value);
            }
          }}
        />
        <TextField
          label={"Телефон"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setPhone(e.target.value);
            }
          }}
        />
        <TextField
          label={"Електронна адреса"}
          fullWidth
          autoFocus
          required
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setEmail(e.target.value);
            }
          }}
        />
        <CustomDataPicker value={birthDate} setValue={setBirthDate} label="Дата народження"/>
        <TextField
          label={"Адреса"}
          fullWidth
          autoFocus
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value) {
              setError(false);
              setAddress(e.target.value);
            }
          }}
        />
        {creationError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {"Клієнт не був створений"}
          </Alert>
        )}
      </>
    </DocumentTemplate>
  );
};

export default AddClientPage;
