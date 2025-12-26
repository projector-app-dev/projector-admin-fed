import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowId,
} from "@mui/x-data-grid";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import type { ClientType } from "../../../services/common.type";
import { deleteUserDocument } from "../../../services/user.service";
import DialogUserActionItem from "../../organisms/DialogUserActionItem/DialogUserActionItem";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";

const UserDatagridTabelPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useAppContext();
  const [rows, setRows] = useState<any>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [typeSnackbar, setTypeSnackbar] = useState<"error" | "success">(
    "success"
  );

  const deleteUser = (id: GridRowId) => {
    deleteUserDocument(id.toString())
      .then(() => {
        setTypeSnackbar("success");
        setOpenSnackbar(true);
      })
      .catch(() => {
        setTypeSnackbar("error");
        setOpenSnackbar(true);
      });
  };
  const editUser = (id: GridRowId) => {
    navigate(`/users/${id.toString()}/edit`);
  };

  const columns = useMemo<GridColDef<ClientType>[]>(
    () => [
      { field: "name", headerName: "ПІБ", resizable: false, flex: 1 },
      { field: "phone", headerName: "Мобільний", resizable: false, flex: 1 },
      { field: "email", headerName: "Емейл", resizable: false, flex: 1 },
      { field: "status", headerName: "Статус", resizable: false, flex: 1 },
      {
        field: "actions",
        type: "actions",
        resizable: false,
        width: 90,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<InfoIcon />}
            label="Інформація"
            onClick={() => navigate(`/users/${params.id.toString()}`)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Редагувати"
            onClick={() => editUser(params.id)}
            showInMenu
          />,
          <DialogUserActionItem
            label="Видалити"
            title={`Видалити цього користувача`}
            buttonTitle="Видалити"
            showInMenu
            icon={<DeleteIcon />}
            deleteUser={() => deleteUser(params.id)}
            closeMenuOnClick={false}
          />,
        ],
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(data);
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Користувачі"}
      isButtonsShown={false}
      buttonLabel=""
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1, flexDirection: "row-reverse" }}
      >
        <Button
          size="small"
          onClick={() => navigate("/users/add", { replace: true })}
        >
          Додати Користувача
        </Button>
      </Stack>
      <DataGrid
        columns={columns}
        rows={rows}
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
            ? "Користувач був видалений"
            : "Користувач не був видалений"}
        </Alert>
      </Snackbar>
    </DocumentInfoTemplate>
  );
};

export default UserDatagridTabelPage;
