import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import List from "@mui/material/List";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import type { ProjectType } from "../../../services/common.type";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ProjectsList = ({ ...props }: ProjectsListType) => {
  const { items } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const open = Boolean(anchorEl);
  const { selectedProject, setSelectedProject } = useAppContext();

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    event.preventDefault();
    setSelectedId(id);
    setSelectedProject(id);
    setAnchorEl(null);

    navigate("/", { replace: true });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(null);
    navigate("/projects/add", { replace: true });
  };

  useEffect(() => {
    if (selectedId === "") {
      setSelectedId(selectedProject);
    } else {
      setSelectedProject(selectedId);
    }
  }, [selectedId]);

  return (
    <div>
      <List>
        <ListItemButton
          id="demo-positioned-button"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary={
              selectedId !== ""
                ? items.find((item) => item.id === selectedId)?.shortName
                : "Проєкти"
            }
            secondary={selectedId !== "" ? "" : "Виберіть проєкт"}
          />
          <ArrowDropDownIcon />
        </ListItemButton>
      </List>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        anchorEl={anchorEl}
        sx={[{ "& .MuiPaper-root": { minWidth: 200 } }]}
        onClose={() => handleClose()}
      >
        {items?.map((item) => {
          return (
            <MenuItem
              key={item.id}
              id={item.id}
              selected={item.id === selectedId}
              onClick={(event) => handleMenuItemClick(event, item.id)}
            >
              <ListItemText primary={item?.shortName} />
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Додати"
            onClick={(event) => handleAddButton(event)}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

type ProjectsListType = {
  items: ProjectType[];
};

export default ProjectsList;
