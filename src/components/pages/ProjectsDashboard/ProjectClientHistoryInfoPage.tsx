import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import {
  convertTimestampIntoDateAndTimeString,
  getHistoryRecordById,
} from "../../../services/client.service";
import type { HistoryType } from "../../../services/common.type";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

const ProjectClientHistoryInfoPage = () => {
  const { projectId, clientId, historyId } = useParams();
  const { loading, setLoading } = useAppContext();
  const [historyRecord, setHistoryRecord] = useState<HistoryType | null>(null);

  useEffect(() => {
    setLoading(true);

    if (projectId && clientId && historyId) {
      getHistoryRecordById(projectId, clientId, historyId)
        .then((historyRecord) => {
          if (historyRecord) {
            setHistoryRecord(historyRecord);
          }
        })
        .catch(() => setHistoryRecord(null));
    }

    setLoading(false);
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Запис клієнта"}
      isButtonsShown={false}
    >
      {historyRecord ? (
        <>
          <Box
            paddingLeft={1}
            paddingTop={1}
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
          >
            <Box>
              <Typography variant="body1">
                {convertTimestampIntoDateAndTimeString(
                  historyRecord.createdAt
                ) || "-"}
              </Typography>
            </Box>
          </Box>
          <Box paddingLeft={1}>
            <Typography variant="subtitle2">Запис</Typography>
            <Divider />
            <Typography variant="body1" gutterBottom sx={{textAlign: "justify"}}>
              {historyRecord.record || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Файли</Typography>
            <Divider />
            <Stack spacing={2}>
              {historyRecord.files?.map((file) => {
                return (<Link href={file.link}  target="_blank" rel="noopener noreferrer">{file.name}</Link>);
              })}
            </Stack>
          </Box>
        </>
      ) : !loading ? (
        <Alert severity="error">Щось пішло не так</Alert>
      ) : null}
    </DocumentInfoTemplate>
  );
};

export default ProjectClientHistoryInfoPage;
