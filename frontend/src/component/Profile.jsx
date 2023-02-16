import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import CarouselComponent from "./CarouselComponent";
import { useParams } from "react-router-dom";
import Identicon from "@polkadot/react-identicon";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from '@mui/material/Fade';

export default function Profile(props) {
  let { address } = useParams();
  const copyToClipboard = async () => {
    handleTooltipOpen();
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand("copy", true, address);
    }
  };
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  // all loans
  // stats
  // tokens
  // frac tokens

  const items = [
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "6d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "5d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "4d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "3d",
      fraction: "30%",
      status: 0,
    },
  ];
  return (
    <Box
      component="div"
      sx={{
        marginTop: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <Typography
          variant="h4"
          textAlign={"center"}
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 0px 0px",
          }}
        >
          Profile
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "70px",
        }}
      >
        <Identicon
          size={40}
          theme={"polkadot"}
          value={address}
          style={{ marginRight: "20px" }}
        />
        <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Address Copied"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          sx={{
            backgroundColor: "gray",
            fontFamily: "'Ubuntu Condensed', sans-serif",
          }}
        >
          <button
            style={{
              backgroundColor: "black",
              cursor: "pointer",
            }}
            onClick={copyToClipboard}
          >
            <Typography
              variant="h6"
              className="returns"
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                fontWeight: "600",
              }}
            >
              {address}
            </Typography>
          </button>
        </Tooltip>
      </ClickAwayListener>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          marginBottom: "100px",
          justifyContent: "center",
        }}
      >
        <Box
          component="div"
          className="profileInfoContainer"
          sx={{
            backgroundColor: "#212224",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            marginRight: "150px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "gray", marginRight: "15px" }}
          >
            Total Raised:
          </Typography>
          <Typography
            variant="body1"
            className="returns"
            sx={{ fontFamily: "'Courgette', cursive" }}
          >
            24.4 ETH
          </Typography>
        </Box>
        <Box
          component="div"
          className="profileInfoContainer"
          sx={{
            backgroundColor: "#212224",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            marginRight: "150px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "gray", marginRight: "15px" }}
          >
            Total Interest:
          </Typography>
          <Typography
            variant="body1"
            className="returns"
            sx={{ fontFamily: "'Courgette', cursive" }}
          >
            24.4 ETH
          </Typography>
        </Box>
        <Box
          component="div"
          className="profileInfoContainer"
          sx={{
            backgroundColor: "#212224",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "gray", marginRight: "15px" }}
          >
            Total Offered:
          </Typography>
          <Typography
            variant="body1"
            className="returns"
            sx={{ fontFamily: "'Courgette', cursive" }}
          >
            24.4 ETH
          </Typography>
        </Box>
      </Box>
      <Box>
        <CarouselComponent items={items} title={"Created Ads"} isLoan={true}/>
      </Box>
    </Box>
  );
}
