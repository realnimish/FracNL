import {
  AppBar,
  Box,
  Button,
  Drawer,
  Menu,
  MenuItem,
  SwipeableDrawer,
} from "@mui/material";
import { useState } from "react";
import "../index.js";
import Logo from "./Logo.jsx";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { cutAddress } from "../commons.js";
import Identicon from "@polkadot/react-identicon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChooseAccount from "./chooseAccount.jsx";
import { Link } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex.js";
function ConnectButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return !props.activeAccount ? (
    <>
      <Box
        className="connectBtn"
        sx={{
          fontFamily: "'Ubuntu Condensed', sans-serif",
          backgroundColor: "rgb(255 255 255 / 44%)",
          padding: "10px 20px",
          cursor: "pointer",
          position: "relative",
          width: "fit-content",
          margin: "0 11.8px",
        }}
        onClick={() => props.handleOpen()}
      >
        Connect Wallet
        <Box
          className="connectBtnBgd"
          sx={{
            position: "absolute",
            bottom: "-6px",
            right: "-5px",
            backgroundColor: "#c93a37",
            height: "110%",
            width: "107%",
            zIndex: "-1",
            filter: "blur(3px)",
          }}
          tabIndex={"2"}
        ></Box>
      </Box>
    </>
  ) : (
    <>
      <Box
        className="connectedBtn"
        sx={{
          fontFamily: "'Ubuntu Condensed', sans-serif",
          padding: "10px 20px",
          cursor: "pointer",
          position: "relative",
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
        id="profile"
        aria-controls={openMenu ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        onClick={(e) => handleClick(e)}
      >
        <Box
          sx={{
            marginRight: "10px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.63)",
            height: "20px",
          }}
        >
          <Identicon
            size={20}
            theme={"polkadot"}
            value={props.activeAccount?.address}
          />
        </Box>
        {cutAddress(props.activeAccount?.address)}
        {!openMenu ? (
          <KeyboardArrowDownIcon sx={{ marginLeft: "10px" }} />
        ) : (
          <KeyboardArrowUpIcon sx={{ marginLeft: "10px" }} />
        )}
      </Box>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile",
        }}
        sx={{ marginTop: "5px" }}
        PaperProps={{
          sx: {
            background: "#03080f",
            color: "white",
            border: "1px solid white",
            marginTop: "5px",
          },
        }}
      >
        <Link
          to={"/profile/" + props.activeAccount?.address}
          style={{ width: "100%", height: "100%", color: "white" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            props.handleOpen();
            handleClose();
          }}
        >
          Change Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.setActiveAccount(null);
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default function NavBar(props) {
  const navItems = [
    { text: "Home", link: "/" },
    { text: "Fractionalise", link: "/fractionalise" },
    { text: "Mint", link: "/mint" },
    { text: "Create an Ad", link: "/list" },
  ];
  const [activeTab, setActiveTab] = useState("Home");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openChooseAccount, setOpenChooseAccount] = useState(false);

  const setSelectedAccount = (acc) => {
    props.setActiveAccount(acc);
  };

  const handleChooseAccClose = () => {
    setOpenChooseAccount(false);
  };

  const handleChooseAccOpen = () => {
    setOpenChooseAccount(true);
  };

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
          <Link to={item.link}>
            <Box
              component="div"
              key={item.text}
              sx={{
                marginRight: "60px",
                fontFamily: "'Ubuntu Condensed', sans-serif",
                fontSize: "16px",
                letterSpacing: "1px",
                cursor: "pointer",
              }}
              className={
                "navBtn " + (activeTab === item.text ? "navBtnActive" : "")
              }
              tabIndex={"1"}
              onClick={() => onNavItemClick(item.text)}
            >
              {item.text}
            </Box>
          </Link>
        ))}
        <ConnectButton
          handleOpen={() => handleChooseAccOpen()}
          setActiveAccount={(acc) => props.setActiveAccount(acc)}
          activeAccount={props.activeAccount}
        />
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
            key={item.text}
          >
            <Link to={item.link}>
              <Box
                component="div"
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
                className={
                  "navBtn " + (activeTab === item.text ? "navBtnActive" : "")
                }
                tabIndex={"1"}
                onClick={() => onNavItemClick(item.text)}
              >
                {item.text}
              </Box>
            </Link>
          </Box>
        ))}
        <Box
          sx={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ConnectButton
            activeAccount={props.activeAccount}
            handleOpen={() => handleChooseAccOpen()}
            setActiveAccount={(acc) => props.setActiveAccount(acc)}
          />
        </Box>
      </Drawer>
      <ChooseAccount
        open={openChooseAccount}
        handleClose={() => handleChooseAccClose()}
        setActiveAccount={(acc) => setSelectedAccount(acc)}
      />
    </AppBar>
  );
}
