import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext/AppContext";
import {
  createCode,
  getClientById,
  getProjectsByClientId,
  updateClientDocument,
} from "../../../../services/client.service";
import type { ProjectType } from "../../../../services/common.type";
import { getAllProjectDocuments } from "../../../../services/projects.service";
import DocumentTemplate from "../../../templates/DocumentTemplate/DocumentTemplate";
import type { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import CustomDataPicker from "../../../molecules/CustomDataPicker/CustomDataPicker";

const EditClientPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [clientProjects, setClientProjects] = useState<ProjectType[]>([]);
  const [selectedClientProjects, setSelectedClientProjects] = useState<
    string[]
  >([]);
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState(false);
  const { setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (clientId) {
      getClientById(clientId).then((client) => {
        if (client) {
          setPhone(client.phone);
          setEmail(client.email);
          setName(client.name);
          setSurname(client.surname);
          setLastName(client.lastName);
          setBirthDate(
            client.birthDate ? dayjs(client.birthDate.toDate()) : null
          );
          setAddress(client.address || "");
        }
        getAllProjectDocuments().then((allProjects) => {
          if (allProjects.length !== 0) {
            setAllProjects(allProjects);
            getProjectsByClientId(clientId).then((projects) => {
              setClientProjects(projects);
              const selectedProjects = projects
                .filter((clientProject) =>
                  allProjects.some((project) => project.id === clientProject.id)
                )
                .map((project) => project.id);
              setSelectedClientProjects(selectedProjects);
            });
          }
        });
      });
    }

    setLoading(false);
  }, []);

  const handleChange = (
    event: SelectChangeEvent<typeof selectedClientProjects>
  ) => {
    const {
      target: { value },
    } = event;
    if (Array.isArray(value)) {
      setSelectedClientProjects(value);
    }
  };

  return (
    <DocumentTemplate
      title="Редагування клтєнта"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (
          clientId &&
          name &&
          surname &&
          lastName &&
          email &&
          phone &&
          birthDate
        ) {
          updateClientDocument(
            {
              code: createCode(name, lastName, surname, birthDate),
              address,
              id: clientId,
              name,
              lastName,
              surname,
              phone,
              email,
              birthDate: Timestamp.fromDate(birthDate.toDate()),
              userIdCreated: "",
            },
            selectedClientProjects,
            clientProjects
          ).then((id) => {
            if (id) {
              navigate("/clients/all", { replace: true });
            }
          });
        } else {
          setError(true);
        }
      }}
    >
      <>
        <TextField
          label={"Прізвище"}
          fullWidth
          autoFocus
          required
          value={surname}
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setSurname(e.target.value);
            }
          }}
        />
        <TextField
          label={"Ім`я"}
          fullWidth
          autoFocus
          required
          value={name}
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
          label={"Побатькові"}
          fullWidth
          autoFocus
          required
          value={lastName}
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setLastName(e.target.value);
            }
          }}
        />
        <TextField
          label={"Телефон"}
          fullWidth
          autoFocus
          required
          value={phone}
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setPhone(e.target.value);
            }
          }}
        />
        <TextField
          label={"Електронна адреса"}
          fullWidth
          autoFocus
          required
          value={email}
          error={error}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setEmail(e.target.value);
            }
          }}
        />
        <CustomDataPicker value={birthDate} setValue={setBirthDate} label="Дата народження" />
        <TextField
          label={"Адреса"}
          fullWidth
          autoFocus
          value={address}
          sx={{ mb: 2 }}
          onChange={(e) => {
            if (e.target.value || e.target.value === "") {
              setError(false);
              setAddress(e.target.value);
            }
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="multiple-chip-label">Проєкти</InputLabel>
          <Select
            labelId="multiple-chip-label"
            id="multiple-chip"
            multiple
            value={selectedClientProjects}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={allProjects.find((t) => t.id === value)?.shortName}
                  />
                ))}
              </Box>
            )}
          >
            {allProjects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.shortName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    </DocumentTemplate>
  );
};

export default EditClientPage;
