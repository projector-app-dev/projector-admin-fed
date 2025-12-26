import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProjectDocument } from "../../../../services/projects.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import CustomDataPicker from "../../../molecules/CustomDataPicker/CustomDataPicker";
import type { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

const AddProjectPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [shortName, setShortName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startProjectDate, setStartProjectDate] = useState<Dayjs | null>(null);
  const [endProjectDate, setEndProjectDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();

  return (
    <DocumentTemplate
      title="Створення проєкту"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (name && shortName && startProjectDate && endProjectDate) {
          addProjectDocument({
            name,
            shortName,
            description,
            startDate: Timestamp.fromDate(startProjectDate.toDate()),
            endDate: Timestamp.fromDate(endProjectDate.toDate()),
            id: "",
          }).then((id) => {
            if (id) {
              navigate("/", { replace: true });
              window.location.reload();
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
          label={"Назва проєкту"}
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
          label={"Коротка назва проєкту"}
          fullWidth
          autoFocus
          error={error}
          required
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setShortName(e.target.value);
            }
          }}
        />
        <TextField
          label={"Опис проєкту"}
          fullWidth
          autoFocus
          multiline
          maxRows={4}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setDescription(e.target.value);
            }
          }}
        />
        <CustomDataPicker
          value={startProjectDate}
          setValue={setStartProjectDate}
          label="Початок проєкту"
        />
        <CustomDataPicker
          value={endProjectDate}
          setValue={setEndProjectDate}
          label="Кінець проєкту"
        />
      </>
    </DocumentTemplate>
  );
};

export default AddProjectPage;
