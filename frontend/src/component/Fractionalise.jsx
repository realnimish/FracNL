import { Box, Snackbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FRACTIONALIZER_ADDRESS, makeQuery, makeTransaction } from "../commons";
import BN from "bn.js";

export default function Fractionalise(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [ercTokensList, setErcTokensList] = useState([
    {
      tokenId: null,
      fractionalized: false,
      ownership: "100%",
    },
  ]);
  const [fracTokensList, setFracTokensList] = useState([
    {
      tokenId: null,
      fractionalized: false,
      ownership: "100%",
    },
  ]);
  const [ercTokens, setErcTokens] = useState([]);
  const [fracTokens, setFracTokens] = useState([]);
  const [selectedErcToken, setSelectedErcToken] = useState(null);
  const [selectedFracToken, setSelectedFracToken] = useState(null);
  const [isApprovedFractionalizer, setIsApprovedFractionalizer] =
    useState(false);
  const [isFractionalized, setIsFractionalized] = useState(false);
  const handleErcTokenChange = (e) => {
    setSelectedErcToken(e.target.value);
  };

  const handleFracTokenChange = (e) => {
    setSelectedFracToken(e.target.value);
  };

  const [userHolding, setUserHolding] = useState(0);

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

  useEffect(() => {
    console.log("Calling getErcTokens..");
    props.activeAccount && getErcTokens();
    console.log("calling getFracTokens..");
    props.activeAccount && getFracTokens();
  }, [props.activeAccount]);

  useEffect(() => {
    let erc = ercTokens.map((token) => {
      return {
        tokenId: token,
        fractionalized: false,
        ownership: "100%",
      };
    });
    console.log("ERC List: ", erc);
    setErcTokensList([
      {
        tokenId: null,
        fractionalized: false,
        ownership: "100%",
      },
      ...erc,
    ]);
  }, [ercTokens]);

  useEffect(() => {
    let frac = fracTokens.map((token) => {
      return {
        tokenId: token[0],
        fractionalized: true,
        ownership:
          (token[1].replace(/,/g, "") * 100) / token[2].replace(/,/g, "") + "%",
      };
    });
    console.log("Frac List: ", frac);
    setFracTokensList([
      {
        tokenId: null,
        fractionalized: false,
        ownership: "100%",
      },
      ...frac,
    ]);
  }, [fracTokens]);

  useEffect(() => {
    getIsFractionalised();
    isTokenIdApprovedForFractionalised();
  }, [selectedErcToken]);

  useEffect(() => {
    getUserFractionHolding();
  }, [selectedFracToken]);

  const fetchFracTabData = () => {
    getIsFractionalised();
    isTokenIdApprovedForFractionalised();
  };

  const fetchDefracTabData = () => {
    getUserFractionHolding();
  };

  const getErcTokens = async () => {
    try {
      // get from ERC 721
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getUserTokens",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens erc: ", val);
          setErcTokens(val.Ok);
        }
      );
    } catch (err) {
      console.log("getUserTokens", err);
    }
  };

  const getFracTokens = async () => {
    try {
      // get from Fractionalizer
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "getUserHoldings",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens frac: ", val);
          setFracTokens(val.Ok);
        },
        (val) => {
          console.log("Error on getUserTokens frac", val);
        }
      ).catch((err) => {
        console.log("getUserTokens Frac", err);
      });
    } catch (err) {
      console.log("getUserTokens", err);
    }
  };

  const isTokenIdApprovedForFractionalised = async () => {
    console.log("isTokenIdApprovedForFractionalised called");
    if (selectedErcToken === null) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getApproved",
        0,
        [selectedErcToken],
        (val) => {
          console.log("getApproved : ", val);
          setIsApprovedFractionalizer(val.Ok == FRACTIONALIZER_ADDRESS);
          console.log(
            "Passed In Common",
            val.Ok == FRACTIONALIZER_ADDRESS,
            val.Ok
          );
        }
      ).catch((err) => {
        console.log("getApproved", err);
      });
    } catch (err) {
      console.log("getApproved", err);
    }
  };

  const approveFractionalised = async () => {
    console.log("Approve Called for fractionalise!");
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "approve",
        props.signer,
        0,
        [FRACTIONALIZER_ADDRESS, selectedErcToken],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "success",
          });
          isTokenIdApprovedForFractionalised();
        },
        () => {
          enqueueSnackbar("Transaction Submitted", {
            variant: "info",
          });
        }
      ).catch((err) => {
        enqueueSnackbar("" + err, { variant: "error" });
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    }
  };

  const getIsFractionalised = async () => {
    if (selectedErcToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "isFractionalized",
        0,
        [selectedErcToken],
        (val) => {
          console.log("isFractionalised : ", val);
          setIsFractionalized(val.Ok === true);
        }
      ).catch((err) => {
        console.log("isFractionalised", err);
      });
    } catch (err) {
      console.log("isFractionalised", err);
    }
  };

  const fractionaliseNFT = async () => {
    console.log("Fractionalise Called");
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "fractionlize",
        props.signer,
        0,
        [selectedErcToken, new BN(100n * 1000_000_000_000n)],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "Success",
          });
          getIsFractionalised();
          getUserFractionHolding();
          setSelectedErcToken(null);
        },
        () => {
          enqueueSnackbar("Transaction submitted", {
            variant: "info",
          });
        }
      ).catch((err) => {
        enqueueSnackbar("" + err, { variant: "error" });
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    }
  };

  const getUserFractionHolding = async () => {
    console.log("getUserFractionHolding called");
    if (selectedFracToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "erc1155::balanceOf",
        0,
        [props.activeAccount.address, selectedFracToken],
        (val) => {
          console.log("getUserFractionHolding : ", val);
          setUserHolding(val.Ok.replace(/,/g, ""));
        }
      ).catch((err) => {
        console.log("getUserFractionHolding", err);
      });
    } catch (err) {
      console.log("getUserFractionHolding", err);
    }
  };

  const defractionaliseNFT = async () => {
    console.log("defractionlize called");
    console.log("selected Frac Token: ", selectedFracToken);
    console.log("address: ", props.activeAccount.address);
    if (selectedFracToken === null || !props.activeAccount.address)
      return false;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "defractionlize",
        props.signer,
        0,
        [selectedFracToken, props.activeAccount.address],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "Success",
          });
          getFracTokens();
          setSelectedFracToken(null);
        },
        () => {
          enqueueSnackbar("Transaction submitted", {
            variant: "info",
          });
        }
      ).catch((err) => {
        enqueueSnackbar("" + err, { variant: "error" });
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    }
  };

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
          onClick={() => {
            getErcTokens();
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
          onClick={() => {
            getFracTokens();
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
            <select
              className="select"
              style={{ marginBottom: "20px" }}
              onChange={(e) => {
                handleErcTokenChange(e);
              }}
            >
              {ercTokensList.map((token, idx) => (
                <option value={token.tokenId} key={idx}>
                  {"Token Id : " +
                    (token.tokenId ? token.tokenId : "Not Selected") +
                    (token.fractionalized
                      ? " (Fractionalized) (Ownership " + token.ownership + ")"
                      : "")}
                </option>
              ))}
            </select>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              marginBottom: "50px",
              marginLeft: "15%",
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
              className={
                "btn " +
                (isFractionalized || isApprovedFractionalizer
                  ? "btn-done"
                  : "btn-green")
              }
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
              onClick={() =>
                !isFractionalized &&
                !isApprovedFractionalizer &&
                approveFractionalised()
              }
            >
              {isFractionalized || isApprovedFractionalizer
                ? "Approved"
                : "Approve"}
            </div>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginBottom: "50px",
              display: "flex",
              justifyContent: "center",
            }}
            className="buttonContainer"
          >
            <div
              className={"btn " + (isFractionalized ? "btn-done" : "btn-green")}
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
              onClick={() => !isFractionalized && fractionaliseNFT()}
            >
              {isFractionalized ? "Fractionalised" : "Fractionalise"}
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
            <select
              className="select"
              style={{ marginBottom: "20px" }}
              onChange={(e) => handleFracTokenChange(e)}
            >
              {fracTokensList.map((token, idx) => (
                <option value={token.tokenId} key={idx}>
                  {"Token Id: " +
                    (token.tokenId ? token.tokenId : "Not Selected") +
                    (token.fractionalized
                      ? " (Fractionalized) (Ownership " + token.ownership + ")"
                      : "")}
                </option>
              ))}
            </select>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginBottom: "50px",
              display: "flex",
              justifyContent: "center",
            }}
            className="buttonContainer"
          >
            <div
              className="btn btn-red"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
              }}
              onClick={() => defractionaliseNFT()}
            >
              Defractionalize NFT
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
