import TextField from "@mui/material/TextField";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import {
  addClientHistory,
  updateClientHistory,
} from "../../../../services/client.service";
import { useAuthContext } from "../../../../contexts/AuthContext/AuthContext";
import MultipleFileInput from "../../../atoms/MultipleFileInput/MultipleFileInput";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AddHistoryPage = () => {
  const navigate = useNavigate();
  const { projectId, clientId } = useParams();
  const { user } = useAuthContext();
  const [record, setRecord] = useState<string>("");
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState({});
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isStartedUploading, setIsStartedUploading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isStartedUploading) {
      setOpenSnackbar(true);
    } else if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  useEffect(() => {
    if (
      (Object.keys(uploading).length === 0 ||
        Object.values(uploading).every((value) => !value)) &&
      !isFirstRender
    ) {
      navigate(`/projects/${projectId}/clients/${clientId}/history`, {
        replace: true,
      });
    }

    setIsFirstRender(false);
  }, [uploading]);

  return (
    <DocumentTemplate
      title="Додавання запису"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isStartedUploading) {
          setOpenSnackbar(true);
        } else {
          setLoading(true);

          if (record && projectId && clientId && user) {
            setIsStartedUploading(true);
            addClientHistory(projectId, clientId, user.uid, record).then(
              (id) => {
                if (id) {
                  if (files.length === 0) {
                    setUploading({});
                  }
                  files.forEach((file) => {
                    setUploading((prev) => ({
                      ...prev,
                      [file.name]: true,
                    }));
                    const storageRef = ref(
                      storage,
                      `uploads/projects/${projectId}/clients/${clientId}/history/${id}/${Date.now()}-${
                        file.name
                      }`
                    );
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        const percent =
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                          100;

                        setProgress((prev) => ({
                          ...prev,
                          [file.name]: percent,
                        }));
                      },
                      (error) => {
                        setUploading((prev) => ({
                          ...prev,
                          [file.name]: false,
                        }));
                        if (
                          Object.keys(uploading).length === 0 ||
                          Object.values(uploading).every((value) => !value)
                        ) {
                          setIsStartedUploading(false);
                        }
                        console.error("Upload error:", error);
                      },
                      async () => {
                        const downloadURL = await getDownloadURL(
                          uploadTask.snapshot.ref
                        );

                        // 2. Save metadata to Firestore
                        await updateClientHistory(
                          projectId,
                          clientId,
                          id,
                          file.name,
                          downloadURL
                        );

                        setUploading((prev) => ({
                          ...prev,
                          [file.name]: false,
                        }));

                        if (
                          Object.keys(uploading).length === 0 ||
                          Object.values(uploading).every((value) => !value)
                        ) {
                          setIsStartedUploading(false);
                        }
                        console.log(`${file.name} uploaded successfully`);
                      }
                    );
                  });
                }
              }
            );
          } else {
            setError(true);
          }

          setLoading(false);
        }
      }}
    >
      <>
        <TextField
          label={"Запис"}
          fullWidth
          required
          multiline
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
        <MultipleFileInput
          onChange={handleFileChange}
          files={files}
          progress={progress}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {"Відбувається збереження файлів"}
          </Alert>
        </Snackbar>
      </>
    </DocumentTemplate>
  );
};

export default AddHistoryPage;
