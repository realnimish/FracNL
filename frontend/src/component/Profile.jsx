import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import CarouselComponent from "./CarouselComponent";
import { useParams } from "react-router-dom";
import Identicon from "@polkadot/react-identicon";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import { makeQuery } from "../commons";

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

  const [stats, setStats] = useState({
    totalRaised: "0",
    totalOffered: "0",
    totalInterest: "0",
  });
  const [score, setScore] = useState(null);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const getUserStats = async () => {
    if (!address) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getUserStats",
        0,
        [address],
        (val) => {
          console.log("getUserStats : ", val);
          let data = val.Ok;
          setStats({
            totalRaised:
              parseInt(data[0].replace(/,/g, "") / 1000_000) / 1000_000,
            totalOffered:
              parseInt(data[1].replace(/,/g, "") / 1000_000) / 1000_000,
            totalInterest:
              parseInt(data[2].replace(/,/g, "") / 1000_000) / 1000_000,
          });
        }
      ).catch((err) => {
        console.log("getUserStats", err);
      });
    } catch (err) {
      console.log("getUserStats", err);
    }
  };

  const getCreditScore = async () => {
    if (!address) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getCreditScore",
        0,
        [address],
        (val) => {
          console.log("getCreditScore : ", val);
          setScore(val.Ok);
        }
      ).catch((err) => {
        console.log("getCreditScore", err);
      });
    } catch (err) {
      console.log("getCreditScore", err);
    }
  };

  useEffect(() => {
    getUserStats();
    getCreditScore();
  }, [address]);

  return (
    <Box
      component="div"
      sx={{
        marginTop: "100px",
      }}
    >
      {!props.activeAccount ? (
        <Box
          sx={{
            marginTop: "100px",
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
              height: "100px",
              width: "300px",
              color: "white",
              background: "#0d0d0d",
              boxShadow: "0px 0px 5px #232323",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            variant={"h6"}
            textAlign={"center"}
          >
            Connect your wallet
          </Typography>{" "}
        </Box>
      ) : (
        <>
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
              justifyContent: "space-around",
              padding: "0 10%",
              flexWrap: "wrap",
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
                marginBottom: "20px",
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
                {stats.totalRaised + " TZERO"}
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
                marginBottom: "20px",
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
                {stats.totalInterest + " TZERO"}
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
                marginBottom: "20px",
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
                sx={{
                  fontFamily: "'Courgette', cursive",
                  letterSpacing: "1.5px",
                }}
              >
                {stats.totalOffered + " TZERO"}
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
                marginBottom: "20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "gray", marginRight: "15px" }}
              >
                Credit score:{" "}
              </Typography>
              <Typography
                variant="body1"
                className="returns"
                sx={{ fontFamily: "'Courgette', cursive" }}
              >
                {score}
              </Typography>
            </Box>
          </Box>
          <Box>
            <CarouselComponent
              title={"Created listings"}
              isLoan={true}
              activeAccount={props.activeAccount}
              contracts={props.contracts}
              api={props.api}
              signer={props.signer}
              address={address}
            />
          </Box>
          <Box>
            <CarouselComponent
              title={"Your NFTs"}
              isNFT={true}
              activeAccount={props.activeAccount}
              contracts={props.contracts}
              api={props.api}
              signer={props.signer}
              address={address}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
