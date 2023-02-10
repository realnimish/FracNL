import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
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
        <button class="navTab active" data-toggle="login">
          <Typography
            variant="body1"
            sx={{
              fontWeight: "400",
              fontFamily: "'Ubuntu Condensed', sans-serif",
            }}
          >
            Fractionalize
          </Typography>
        </button>
        <button class="navTab" data-toggle="register">
          <Typography
            variant="body1"
            sx={{
              fontWeight: "400",
              fontFamily: "'Ubuntu Condensed', sans-serif",
            }}
          >
            Defractionalize
          </Typography>
        </button>
      </div>
      <div class="contentWrapper">
        <div class="content active" id="login">
          <Box sx={{ width: "100%", marginBottom: "40px"}} className="buttonContainer">
            <div
              className="btn btn-green"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
            >
              Fractionalize your NFT
            </div>
          </Box>
        </div>
        <div class="content" id="register">
          <Box sx={{ width: "100%", marginBottom: "40px" }} className="buttonContainer">
            <div
              className="btn btn-red"
              tabIndex={1}
              style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
            >
              Defractionalize your NFT
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
