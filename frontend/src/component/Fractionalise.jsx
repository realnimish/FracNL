import { Box, Snackbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";

export default function Fractionalise(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [tokenList, setTokensList] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
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
          style={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            borderTopLeftRadius: "30px",
          }}
        >
          Fractionalize
        </button>
        <button
          class="navTab"
          data-toggle="defrac"
          style={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            borderTopRightRadius: "30px",
          }}
        >
          Defractionalize
        </button>
      </div>
      <div class="contentWrapper">
        <div class="content active" id="frac">
          <Box
            className="selectContainer"
            sx={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              className="selectLabel"
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            >
              {"Select token Id : "}
            </label>
            <select className="select" style={{ marginBottom: "20px" }}>
              <option value="1">Token Id : 1</option>
              <option value="2">Token Id: 2</option>
              <option value="7">Token Id: 7</option>
              <option value="8">
                {"Token Id: 8 (Fractionalised)(Ownership 30%)"}
              </option>
            </select>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              marginBottom: "50px",
              marginLeft: "15%"
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
            sx={{ width: "100%", marginBottom: "50px", display: "flex", justifyContent: "center" }}
            className="buttonContainer"
          >
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
        <div class="content" id="defrac">
          <Box
            className="selectContainer"
            sx={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              className="selectLabel"
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            >
              {"Select token Id : "}
            </label>
            <select className="select" style={{ marginBottom: "20px" }}>
              <option value="1">Token Id : 1</option>
              <option value="2">Token Id: 2</option>
              <option value="7">Token Id: 7</option>
              <option value="8">
                {"Token Id: 8 (Fractionalised)(Ownership 30%)"}
              </option>
            </select>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              marginLeft: "15%",
              marginBottom: "50px",
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
            sx={{ width: "100%", marginBottom: "50px", display: "flex", justifyContent: "center" }}
            className="buttonContainer"
          >
            <div
              className="btn btn-red"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
            >
              Defractionalize your NFT
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
