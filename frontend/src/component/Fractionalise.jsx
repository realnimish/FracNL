import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

export default function Fractionalise(props) {
  useEffect(() => {
    const tabs = document.querySelector(".tabs");
    const tabButton = document.querySelectorAll(".navTab");
    const content = document.querySelectorAll(".content");

    tabs.addEventListener("click", (e) => {
      const id = e.target.dataset.toggle;
      if (id) {
        tabButton.forEach((navTab) => {
          navTab.classList.remove("active");
        });
        e.target.classList.add("active");
      }
      content.forEach((content) => {
        content.classList.remove("active");
      });

      const element = document.getElementById(id);
      element.classList.add("active");
    });
  }, []);

  return (
    <div class="wrapper">
      <div class="tabs">
        <button
          class="navTab active"
          data-toggle="frac"
          style={{ fontFamily: "'Ubuntu Condensed', sans-serif", borderTopLeftRadius: "30px" }}
        >
          Fractionalize
        </button>
        <button
          class="navTab"
          data-toggle="defrac"
          style={{ fontFamily: "'Ubuntu Condensed', sans-serif", borderTopRightRadius: "30px" }}
        >
          Defractionalize
        </button>
      </div>
      <div class="contentWrapper">
        <div class="content active" id="frac">
          <Typography
            variant="body1"
            sx={{
              marginLeft: "65px",
              fontWeight: "400",
              color: "#404258",
            }}
          >
            Token ID
          </Typography>
          <Box
            component="div"
            sx={{
              marginBottom: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              id="filled-number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              sx={{
                backgroundColor: "#262626",
                borderRadius: "20px",
              }}
            />
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              paddingRight: "60px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#404258", marginRight: "30px" }}
            >
              {" "}
              * Approve your ERC 721 NFT
            </Typography>
            <div
              className="btn btn-green"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
            >
              Approve
            </div>
          </Box>
          <Box
            sx={{ width: "100%", marginBottom: "40px" }}
            className="buttonContainer"
          >
            <div
              className="btn btn-green"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                marginRight: "30%",
              }}
            >
              Fractionalize your NFT
            </div>
          </Box>
        </div>
        <div class="content" id="defrac">
          <Typography
            variant="body1"
            sx={{
              marginLeft: "80px",
              fontWeight: "400",
              color: "#404258",
            }}
          >
            Token ID
          </Typography>
          <Box
            component="div"
            sx={{
              marginBottom: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              id="filled-number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              sx={{
                backgroundColor: "#262626",
                borderRadius: "20px",
              }}
            />
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              paddingRight: "60px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#404258", marginRight: "30px" }}
            >
              {" "}
              * Disapprove your ERC 721 NFT
            </Typography>
            <div
              className="btn btn-red"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
            >
              Disapprove
            </div>
          </Box>
          <Box
            sx={{ width: "100%", marginBottom: "40px" }}
            className="buttonContainer"
          >
            <div
              className="btn btn-red"
              tabIndex={1}
              style={{ fontFamily: "'Ubuntu Condensed', sans-serif",
                        marginRight: "30%" }}
            >
              Defractionalize your NFT
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
