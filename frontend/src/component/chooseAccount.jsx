import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Identicon from "@polkadot/react-identicon";
import { useEffect, useState } from "react";
import { getAllAccounts } from "../commons.js";
import polkadotjs from "../assets/polkadotjs.svg";
import polkawallet from "../assets/polkawallet.webp";
export default function ChooseAccount(props) {
  const [allAccounts, setAllAccounts] = useState([]);
  useEffect(() => {
    async function tmp() {
      const allAcc = await getAllAccounts();
      setAllAccounts(allAcc);
    }
    props.open && tmp();
  }, [props.open]);
  const handleSelectAccount = (acc) => {
    props.setActiveAccount(acc);
    props.handleClose();
  };
  return (
    <Dialog
      onClose={props.handleClose}
      open={props.open}
      PaperProps={{
        sx: {
            backgroundImage: "linear-gradient(to bottom right, #232323, #0a0a0a)",
            color: "#ffffff",
            border: "1px solid white",
        }
      }}
    >
      <DialogTitle>
        {allAccounts.length === 0
          ? "Please install Polkadot.{js} extension"
          : "Select Account"}
      </DialogTitle>
      {allAccounts.length === 0 && (
        <Box
          sx={{
            width: "80%",
            height: "180px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <a href="https://polkadot.js.org/extension/">
            <img
              src={polkadotjs}
              alt={"Polkadot js extention"}
              style={{ width: "70px" }}
            />
          </a>
          <Typography
            variant="body1"
            sx={{ fontWeight: "500", margin: "20px 0" }}
          >
            Or Install Polkawallet for Android
          </Typography>
          <a href="https://play.google.com/store/apps/details?id=io.polkawallet.www.polka_wallet">
            <img
              src={polkawallet}
              alt={"Polkawallet Android App"}
              style={{ width: "70px" }}
            />
          </a>
        </Box>
      )}
      <List sx={{ padding: "0 20px 20px 20px" }}>
        {allAccounts.map((account, idx) => {
          return (
            <ListItem
              onClick={() => handleSelectAccount(account)}
              key={idx}
              sx={{ overflowX: "hidden", cursor: "pointer" }}
            >
              <ListItemAvatar>
                <Avatar>
                  <Identicon
                    size={40}
                    theme={"polkadot"}
                    value={account.address}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={account.address}
                primary={account.meta.name}
                secondaryTypographyProps={{
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: "200px",
                    color: "gray"
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}
