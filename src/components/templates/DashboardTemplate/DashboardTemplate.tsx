import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext/AuthContext";
import { getUserByUid, isUserAdminByUid } from "../../../services/user.service";
import NavBar from "../../organisms/NavBar/NavBar";
import type { NavLinkType } from "../../organisms/NavBar/NavBar.type";
import SidePanel from "../../organisms/SidePanel/SidePanel";
import type { DashboardTemplateType } from "./DashboardTemplate.type";
import { useEffect, useState } from "react";
import type { UserType } from "../../../services/common.type";

const DashboardTemplate = (props: DashboardTemplateType) => {
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const navLinksArray = [
    {
      title: "Проєкти",
      path: "/",
    },
    {
      title: "Клієнти",
      path: "/clients/all",
    },
    {
      title: "Звіт",
      path: "/report/generate",
    },
  ] as NavLinkType[];
  const [navLinks, setNavLinks] = useState<NavLinkType[]>(navLinksArray);

  useEffect(() => {
    if (user) {
      isUserAdminByUid(user.uid)
        .then((isAdmin) => {
          if (isAdmin) {
            const adminNavLinks = navLinksArray;
            adminNavLinks.push({
              title: "Користувачі",
              path: "/users/all",
            });
            setNavLinks(adminNavLinks);
          } else {
            setNavLinks(navLinksArray);
          }
        })
        .catch(() => {
          setNavLinks(navLinksArray);
        });
      getUserByUid(user.uid)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => setCurrentUser(null));
    }
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box>
          <NavBar
            title={props.navTitle}
            navLinks={navLinks}
            currentUser={currentUser}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box>
            <SidePanel
              config={props.config}
              sidePanelLinks={props.sidePanelLinks}
              isSidePanelLinksShown={props.isSidePanelLinksShown}
              isProjectSelectorShown={props.isProjectSelectorShown}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Container>
              <Outlet />
            </Container>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardTemplate;
