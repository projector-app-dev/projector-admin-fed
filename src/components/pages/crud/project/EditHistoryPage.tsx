import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import { useAuthContext } from "../../../../contexts/AuthContext/AuthContext";
import {
  getHistoryRecordById,
  updateClientHistoryRecord,
} from "../../../../services/client.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import CustomDataPicker from "../../../molecules/CustomDataPicker/CustomDataPicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

const EditHistoryPage = () => {
  const navigate = useNavigate();
  const { projectId, clientId, historyId } = useParams();
  const { user } = useAuthContext();
  const [record, setRecord] = useState<string>("");
  const [createAtDate, setCreateAttDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (projectId && historyId && clientId) {
      getHistoryRecordById(projectId, clientId, historyId).then((history) => {
        if (history) {
          setRecord(history.record);
          setCreateAttDate(
            history.createdAt ? dayjs(history.createdAt.toDate()) : null
          );
        }
      });
    }

    setLoading(false);
  }, []);

  return (
    <DocumentTemplate
      title="Редагування запису"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (
          record &&
          projectId &&
          historyId &&
          clientId &&
          user &&
          createAtDate
        ) {
          updateClientHistoryRecord(
            projectId,
            clientId,
            historyId,
            record,
            Timestamp.fromDate(createAtDate.toDate())
          );
          navigate(`/projects/${projectId}/clients/${clientId}/history`, {
            replace: true,
          });
        } else {
          setError(true);
        }

        setLoading(false);
      }}
    >
      <>
        <TextField
          label={"Запис"}
          fullWidth
          required
          multiline
          value={record}
          error={error}
          maxRows={4}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setRecord(e.target.value);
            }
          }}
        />
        <CustomDataPicker
          value={createAtDate}
          setValue={setCreateAttDate}
          label="Дата створення"
        />
      </>
    </DocumentTemplate>
  );
};

export default EditHistoryPage;
