import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import { getUserById, updateUserDocument } from "../../../../services/user.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (userId) {
      getUserById(userId).then((user) => {
        if (user) {
          setName(user.name);
          setPhone(user.phone);
        }
      });
    }

    setLoading(false);
  }, []);

  return (
    <DocumentTemplate
      title="Редагування кліента"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (userId && name && phone) {
          updateUserDocument({
            name,
            phone,
            email: "",
            id: userId,
          }).then((id) => {
            if (id) {
              navigate("/users/all", { replace: true });
            }
          });
        } else {
          setError(true);
        }
      }}
    >
      <>
        <TextField
          label={"ПІБ"}
          fullWidth
          required
          value={name}
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
          value={phone}
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setPhone(e.target.value);
            }
          }}
        />
      </>
    </DocumentTemplate>
  );
};

export default EditUserPage;
