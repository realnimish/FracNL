import { AppBar, Box, Button, Drawer, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import "../index.js";
import Logo from "./Logo.jsx";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
export default function NavBar(props) {
  const navItems = ["Home", "Fractionalize", "Mint", "Create an Ad"];
  const [activeTab, setActiveTab] = useState("Home");
  const [openDrawer, setOpenDrawer] = useState(false);
  const onNavItemClick = (tab) => {
    setActiveTab(tab);
  };
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  return (
    <AppBar
      component="nav"
      sx={{
        height: "60px",
        padding: "0 7%",
        background: "#03080f",
        zIndex: "99999",
      }}
    >
      <Logo />
      <Box
        sx={{
          display: { sm: "none", xs: "none", md: "flex" },
          right: "0px",
          top: "0px",
          height: "100%",
          alignItems: "center",
          position: "absolute",
          padding: "0 7%",
        }}
      >
        {navItems.map((item) => (
          <Box
            component="div"
            key={item}
            sx={{
              marginRight: "60px",
              fontFamily: "'Ubuntu Condensed', sans-serif",
              fontSize: "16px",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
            className={"navBtn " + (activeTab === item ? "navBtnActive" : "")}
            tabIndex={"1"}
            onClick={() => onNavItemClick(item)}
          >
            {item}
          </Box>
        ))}
      </Box>
      <Box
        className="hamburger"
        sx={{
          position: "absolute",
          right: "0px",
          top: "0px",
          height: "100%",
          marginRight: "7%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!openDrawer ? (
          <MenuOpenIcon
            sx={{
              display: { xs: "block", md: "none" },
              fontSize: "30px",
              cursor: "pointer",
            }}
            onClick={() => toggleDrawer()}
          />
        ) : (
          <CloseIcon
            sx={{
              display: { xs: "block", md: "none" },
              fontSize: "30px",
              cursor: "pointer",
            }}
            onClick={() => toggleDrawer()}
          />
        )}
      </Box>
      <Drawer
        open={openDrawer}
        sx={{
          position: "absolute",
          top: "80px",
          left: "0px",
          display: { xs: "block", md: "none" },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#03080f",
            marginTop: "60px",
            padding: "40px 0",
          },
        }}
      >
        {navItems.map((item) => (
          <Box
            sx={{
              width: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="div"
              key={item}
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                fontSize: "16px",
                letterSpacing: "1px",
                cursor: "pointer",
                height: "30px",
                width: "fit-content",
                backgroundColor: "#03080f",
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className={"navBtn " + (activeTab === item ? "navBtnActive" : "")}
              tabIndex={"1"}
              onClick={() => onNavItemClick(item)}
            >
              {item}
            </Box>
          </Box>
        ))}
      </Drawer>
    </AppBar>
  );
}
