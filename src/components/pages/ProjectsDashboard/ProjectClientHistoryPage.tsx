import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import EditIcon from "@mui/icons-material/Edit";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowId,
} from "@mui/x-data-grid";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import { deleteClientHistory } from "../../../services/client.service";
import type { HistoryType } from "../../../services/common.type";
import { getUserByUid, isUserAdminByUid } from "../../../services/user.service";
import DialogUserActionItem from "../../organisms/DialogUserActionItem/DialogUserActionItem";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";
import { useAuthContext } from "../../../contexts/AuthContext/AuthContext";

const ProjectClientHistoryPage = () => {
  const { projectId, clientId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any>([]);
  const { setLoading } = useAppContext();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [typeSnackbar, setTypeSnackbar] = useState<"error" | "success">(
    "success"
  );

  const showClientHistoryRecord = (id: GridRowId) => {
    navigate(
      `/projects/${projectId}/clients/${clientId}/history/${id.toString()}`
    );
  };

  const deleteHistory = (id: GridRowId) => {
    if (projectId && clientId) {
      deleteClientHistory(projectId, clientId, id.toString())
        .then(() => {
          setTypeSnackbar("success");
          setOpenSnackbar(true);
        })
        .catch(() => {
          setTypeSnackbar("error");
          setOpenSnackbar(true);
        });
    }
  };

  const onClickButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    navigate(`/projects/${projectId}/clients/${clientId}/history/add`);
  };

  const convertTimestamp = (timestamp: any) => {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    date = hours + ":" + minutes + " " + dd + "." + mm + "." + yyyy;
    return date;
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, `clients/${clientId}/projects/${projectId}/history`),
      (snapshot) => {
        let data: any[] = [];
        snapshot.docs.map((doc) => {
          getUserByUid(doc.data().userId)
            .then((user) => {
              const row = {
                id: doc.id,
                createdAt: convertTimestamp(doc.data().createdAt),
                record: doc.data().record,
                fileCount: doc.data()?.files?.length ?? 0,
                user: user ? user.name : "",
              };
              data = [...data, row];
            })
            .finally(() => setRows(data));
        });

        setRows(data);
      }
    );
    setLoading(false);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
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
  }, []);

  const columns = useMemo<GridColDef<HistoryType>[]>(
    () => [
      { field: "record", headerName: "Запис", resizable: false, flex: 1 },
      { field: "user", headerName: "Працівник", resizable: false, flex: 1 },
      {
        field: "fileCount",
        headerName: "Кількість файлів",
        resizable: false,
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "Дата Створення",
        resizable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        resizable: false,
        width: 90,
        getActions: (params) => {
          return isAdmin
            ? [
                <GridActionsCellItem
                  icon={<InfoIcon />}
                  label="Інформація"
                  onClick={() => showClientHistoryRecord(params.id)}
                />,
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Редагувати"
                  showInMenu
                  onClick={() =>
                    navigate(
                      `/projects/${projectId}/clients/${clientId}/history/edit/${params.id.toString()}`
                    )
                  }
                />,
                <DialogUserActionItem
                  label="Видалити"
                  title={`Видалити цей запис`}
                  buttonTitle="Видалити"
                  showInMenu
                  icon={<DeleteIcon />}
                  deleteUser={() => deleteHistory(params.id)}
                  closeMenuOnClick={false}
                />,
              ]
            : [
                <GridActionsCellItem
                  icon={<InfoIcon />}
                  label="Інформація"
                  onClick={() => showClientHistoryRecord(params.id)}
                />,
              ];
        },
      },
    ],
    [isAdmin]
  );

  return (
    <DocumentInfoTemplate
      documentTitel={"Історія клієнта"}
      isButtonsShown={projectId !== null && clientId !== null}
      onClickButton={onClickButton}
      buttonLabel="Додати запис"
    >
      <DataGrid
        columns={columns}
        rows={rows}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { allColumns: true },
          },
        }}
        localeText={{
          toolbarExportCSV: "Скачати CSV файл",
        }}
        disableColumnFilter
        showToolbar
        disableColumnSelector
        density="compact"
        pageSizeOptions={[5, 10]}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={typeSnackbar}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {typeSnackbar === "success"
            ? "Запис був видалений"
            : "Запис не був видалений"}
        </Alert>
      </Snackbar>
    </DocumentInfoTemplate>
  );
};

export default ProjectClientHistoryPage;
