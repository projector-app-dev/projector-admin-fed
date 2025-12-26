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
import { deleteClientDocument } from "../../../services/client.service";
import type { UserType } from "../../../services/common.type";
import DialogUserActionItem from "../../organisms/DialogUserActionItem/DialogUserActionItem";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";

const ClientDatagridTabelPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useAppContext();
  const [rows, setRows] = useState<any>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const deleteClient = (id: GridRowId) => {
    deleteClientDocument(id.toString()).then(() => setOpenSnackbar(true));
  };
  const editClient = (id: GridRowId) => {
    navigate(`/clients/${id.toString()}/edit`);
  };

  const columns = useMemo<GridColDef<UserType>[]>(
    () => [
      {
        field: "surnameNameLastName",
        headerName: "ПІБ",
        resizable: false,
        disableExport: true,
        flex: 1,
      },
      {
        field: "code",
        hideable: true,
        flex: 1,
      },
      {
        field: "phone",
        headerName: "Телефон",
        resizable: false,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Електронний адрес",
        resizable: false,
        flex: 1,
      },
      { field: "address", headerName: "Адреса", resizable: false, flex: 1 },
      {
        field: "actions",
        type: "actions",
        resizable: false,
        width: 90,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<InfoIcon />}
            label="Інформація"
            onClick={() => navigate(`/clients/${params.id.toString()}`)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Редагувати"
            onClick={() => editClient(params.id)}
            showInMenu
          />,
          <DialogUserActionItem
            label="Видалити"
            title="Видалити цього користувача"
            buttonTitle="Видалити"
            showInMenu
            icon={<DeleteIcon />}
            deleteUser={() => deleteClient(params.id)}
            closeMenuOnClick={false}
          />,
        ],
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        surnameNameLastName: `${
          doc.data().surname + " " + doc.data().name + " " + doc.data().lastName
        }`,
        code: doc.data().code,
        phone: doc.data().phone,
        email: doc.data().email,
        address: doc.data().address,
      }));
      setRows(data);
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Клієнти"}
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
          onClick={() => navigate("/clients/add", { replace: true })}
        >
          Додати Клієнта
        </Button>
      </Stack>
      <DataGrid
        columns={columns}
        rows={rows}
        pageSizeOptions={[5, 10]}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { allColumns: true },
          },
        }}
        localeText={{
          toolbarExportCSV: "Скачати CSV файл"
        }}
        disableColumnFilter
        showToolbar
        disableColumnSelector
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
          {"Клієнт був видалений"}
        </Alert>
      </Snackbar>
    </DocumentInfoTemplate>
  );
};

export default ClientDatagridTabelPage;
