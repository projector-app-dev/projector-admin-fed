import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowId,
} from "@mui/x-data-grid";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import type { ClientType } from "../../../services/common.type";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";

const ProjectClientsDatagridTabelPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { setLoading } = useAppContext();
  const [rows, setRows] = useState<any>([]);
  const editClient = (id: GridRowId) => {
    navigate(`/clients/${id.toString()}/edit`);
  };
  const showClientHistory = (id: GridRowId) => {
    navigate(`/projects/${projectId}/clients/${id.toString()}/history`);
  };

  const columns = useMemo<GridColDef<ClientType>[]>(
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
          <GridActionsCellItem
            icon={<HistoryIcon />}
            label="Історія"
            onClick={() => showClientHistory(params.id)}
            showInMenu
          />,
        ],
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);

    const citiesRef = collection(db, "clients");

    let clients: ClientType[] = [];

    getDocs(citiesRef).then((querySnapshot) => {
      querySnapshot.forEach((doct) => {
        getDoc(doc(db, `${doct.ref.path}/projects/${projectId}`))
          .then((project) => {
            if (project.exists()) {
              clients = [
                ...clients,
                {
                  id: doct.id,
                  surnameNameLastName: `${
                    doct.data().surname +
                    " " +
                    doct.data().name +
                    " " +
                    doct.data().lastName
                  }`,
                  code: doct.data().code,
                  phone: doct.data().phone,
                  email: doct.data().email,
                  address: doct.data().address,
                } as ClientType,
              ];
            }
          })
          .finally(() => setRows(clients));
      });
    });

    setRows(clients);

    setLoading(false);
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Клієнти "}
      isButtonsShown={false}
      buttonLabel=""
    >
      <DataGrid
        columns={columns}
        rows={rows}
        density="compact"
        pageSizeOptions={[5, 10]}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { allColumns: true,fileName: "Клієнти проєкту", },
          },
        }}
        localeText={{
          toolbarExportCSV: "Скачати CSV файл"
        }}
        disableColumnFilter
        showToolbar
        disableColumnSelector
      />
    </DocumentInfoTemplate>
  );
};

export default ProjectClientsDatagridTabelPage;
