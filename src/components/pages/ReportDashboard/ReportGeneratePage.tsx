import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  collectionGroup,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import { useAuthContext } from "../../../contexts/AuthContext/AuthContext";
import { convertTimestampIntoDateAndTimeString } from "../../../services/client.service";
import type { ProjectType, UserType } from "../../../services/common.type";
import { getAllProjectDocuments } from "../../../services/projects.service";
import {
  getAllUsers,
  getUserByUid,
  isUserAdminByUid,
} from "../../../services/user.service";
import WorkReport from "../../reports/WorkReport/WorkReport";
import type { RecordType } from "../../reports/WorkReport/WorkrReport.type";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";
import CustomDataPicker from "../../molecules/CustomDataPicker/CustomDataPicker";
import type { Dayjs } from "dayjs";

const ReportGeneratePage = () => {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userName, serUserName] = useState<string>("");
  const [mainText, setMainText] = useState<string>("");
  const [summaryText, setSummaryText] = useState<string>("");
  const [recordData, setRecordData] = useState<RecordType[]>([]);
  const [isStartedGenerating, setIsStartedGenerating] =
    useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [startData, setStartData] = useState<Dayjs | null>(null);
  const [endData, setEndData] = useState<Dayjs | null>(null);
  const { setLoading } = useAppContext();

  const onClickButton = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setRecordData([]);
    setIsStartedGenerating(true);

    if (
      user &&
      selectedProject &&
      startData &&
      endData &&
      ((isAdmin && selectedUser) || !isAdmin)
    ) {
      let historyQuery = query(
        collectionGroup(db, "history"),
        where("projectId", "==", selectedProject)
      );

      if (isAdmin) {
        historyQuery = query(historyQuery, where("userId", "==", selectedUser));
      } else {
        historyQuery = query(historyQuery, where("userId", "==", user.uid));
      }

      historyQuery = query(historyQuery, where("createdAt", ">=", startData.toDate()))
      historyQuery = query(historyQuery, where("createdAt", "<=", endData.endOf('day').toDate()))

      try {
        let data: RecordType[] = [];
        const querySnapshot = await getDocs(historyQuery);
        for (const doc of querySnapshot.docs) {
          if (doc.ref.parent.parent) {
            const projectParent = await getDoc(doc.ref.parent.parent);
            if (projectParent.ref.parent.parent) {
              const clientParent = await getDoc(
                projectParent.ref.parent.parent
              );
              if (clientParent) {
                data.push({
                  clientCode: clientParent.data()?.code,
                  data: convertTimestampIntoDateAndTimeString(
                    doc.data().createdAt
                  ),
                  record: doc.data().record,
                } as RecordType);
              }
            }
          }
        }
        if (data.length > 0) {
          getUserByUid(isAdmin ? selectedUser : user.uid).then((user) => {
            if (user) {
              serUserName(user.name);
              setRecordData(data);
            }
          });
        } else {
          setRecordData(data);
          setSnackbarMessage("Немає записів на вибраному проєкті в цей період");
          setOpenSnackbar(true);
        }
      } catch (e) {
        console.log(e);
        setSnackbarMessage("Сталася помилка");
        setOpenSnackbar(true);
      }
    }

    setIsStartedGenerating(false);
  };

  useEffect(() => {
    setLoading(true);

    getAllProjectDocuments().then((projects) => {
      setProjects(projects);
    });
    getAllUsers().then((users) => {
      setUsers(users);
    });
    if (user) {
      isUserAdminByUid(user.uid)
        .then((admin) => {
          if (admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch(() => {
          setIsAdmin(false);
        });
    }

    setLoading(false);
  }, []);

  const handleProjectChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value as string);
  };

  const handleUserChange = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value as string);
  };

  return (
    <DocumentInfoTemplate
      documentTitel={"Генерація звіту"}
      isButtonsShown={true}
      onClickButton={onClickButton}
      buttonLabel="Згенерувати"
    >
      <Divider />
      <FormControl fullWidth sx={{ marginBottom: 2 }} required>
        <InputLabel id="multiple-chip-label">Проєкти</InputLabel>
        <Select
          value={selectedProject}
          label="Виберіть проєкт"
          required
          onChange={handleProjectChange}
        >
          {projects.map((project) => {
            return (
              <MenuItem
                value={project.id}
              >{`${project.name} (${project.shortName})`}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {isAdmin ? (
        <FormControl fullWidth sx={{ marginBottom: 2 }} required>
          <InputLabel id="multiple-chip-label">Користувачі</InputLabel>
          <Select
            value={selectedUser}
            required
            label="Виберіть користувача"
            onChange={handleUserChange}
          >
            {users.map((user) => {
              return (
                <MenuItem
                  value={user.accountId}
                >{`${user.name} (${user.status})`}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : null}
      <Box sx={{ display: "flex", direction:"row"}}>
        <CustomDataPicker
          value={startData}
          setValue={setStartData}
          label="Від"
        />
        <CustomDataPicker value={endData} setValue={setEndData} label="До" />
      </Box>
      <TextField
        label={"Основний текст"}
        fullWidth
        multiline
        value={mainText}
        //  error={error}
        sx={{ mb: 2 }}
        onChange={(e) => {
          if (e.target.value || e.target.value === "") {
            // setError(false);
            setMainText(e.target.value);
          }
        }}
      />
      <TextField
        label={"Заключення"}
        fullWidth
        multiline
        value={summaryText}
        //  error={error}
        sx={{ mb: 2 }}
        onChange={(e) => {
          if (e.target.value || e.target.value === "") {
            //  setError(false);
            setSummaryText(e.target.value);
          }
        }}
      />
      <Box sx={{ display: "flex", position: "absolute", paddingTop: 1 }}>
        {isStartedGenerating && <CircularProgress sx={{ fontSize: 40 }} />}
        {recordData.length > 0 && (
          <PDFDownloadLink
            document={
              <WorkReport
                projectName={
                  projects.find((project) => project.id === selectedProject)
                    ?.name
                }
                summeryText={summaryText}
                mainText={mainText}
                userName={userName}
                records={recordData}
                startData={startData}
                endData={endData}
              />
            }
            fileName={`${userName.replaceAll(" ", "_")}.pdf`}
          >
            {({ loading, error }) => {
              if (error) {
              }
              return loading ? (
                <CircularProgress sx={{ fontSize: 40 }} />
              ) : (
                <Button variant="contained">
                  {"Скачати звіт "}
                  <SimCardDownloadIcon />
                </Button>
              );
            }}
          </PDFDownloadLink>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DocumentInfoTemplate>
  );
};

export default ReportGeneratePage;
