import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import TextField from "@mui/material/TextField";
import {
  getProjectById,
  updateProjectDocument,
} from "../../../../services/projects.service";
import CustomDataPicker from "../../../molecules/CustomDataPicker/CustomDataPicker";
import type { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [shortName, setShortName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startProjectDate, setStartProjectDate] = useState<Dayjs | null>(null);
  const [endProjectDate, setEndProjectDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (projectId) {
      getProjectById(projectId).then((project) => {
        if (project) {
          setName(project.name);
          setShortName(project.shortName);
          setDescription(project.description || "");
          setStartProjectDate(
            project.startDate ? dayjs(project.startDate.toDate()) : null
          );
          setEndProjectDate(
            project.endDate ? dayjs(project.endDate.toDate()) : null
          );
        }
      });
    }

    setLoading(false);
  }, []);

  return (
    <DocumentTemplate
      title="Редагування проєкту"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (
          projectId &&
          name &&
          shortName &&
          startProjectDate &&
          endProjectDate
        ) {
          updateProjectDocument({
            name,
            shortName,
            description,
            startDate: Timestamp.fromDate(startProjectDate.toDate()),
            endDate: Timestamp.fromDate(endProjectDate.toDate()),
            id: projectId,
          }).then((id) => {
            if (id) {
              navigate(`/projects/${projectId}`, { replace: true });
            }
          });
        } else {
          setError(true);
        }
      }}
    >
      <>
        <TextField
          label={"Назва проєкту"}
          fullWidth
          value={name}
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
          value={shortName}
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
          value={description}
          multiline
          maxRows={4}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
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

export default EditProjectPage;
