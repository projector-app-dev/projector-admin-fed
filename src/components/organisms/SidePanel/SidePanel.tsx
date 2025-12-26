import {
  Drawer,
  Toolbar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ProjectsList from "../../molecules/ProjectsList/ProjectsList";
import type { SidePanelType } from "./SidePanel.type";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

const SidePanel = (props: SidePanelType) => {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        {props.isProjectSelectorShown && props.config ? (
          <ProjectsList items={props.config} />
        ) : null}
        <Divider />
        <List>
          {props.isSidePanelLinksShown &&
            props.sidePanelLinks.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.link)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidePanel;
