import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  makeTransaction,
  FRACTIONALIZER_ADDRESS,
  makeQuery,
  NFT_LENDING_ADDRESS,
} from "../commons";
import BN from "bn.js";
import { useSnackbar } from "notistack";

export default function ListNFT(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isApprovedFractionalizer, setIsApprovedFractionalizer] = useState(false);
  const [isApprovedNFTLending, setIsApprovedNFTLending] = useState(false);
  const [collateralRequired, setCollateralRequired] = useState(0);
  const [isFractionalized, setIsFractionalized] = useState(false);
  const [tokensList, setTokensList] = useState([
    {
      tokenId: 0,
      fractionalized: true,
      ownership: "100%",
    },
    {
      tokenId: 1,
      fractionalized: false,
      ownership: "",
    },
    {
      tokenId: 2,
      fractionalized: false,
      ownership: "",
    },
  ]);
  const [userHolding, setUserHolding] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const [userInput, setUserInput] = useState({
    amount: "",
    duration: "",
    fraction: "",
  });

  const handleTokenChange = (e) => {
    setSelectedToken(e.target.value);
  };

  useEffect(() => {
    getUserTokens();
  }, []);

  useEffect(() => {
    getIsFractionalised();
    isTokenIdApprovedForFractionalised();
    isApprovedForNFT();
    getUserFractionHolding();
  }, [selectedToken]);

  useEffect(() => {
    if(userInput.duration && userInput.duration !== "" && userInput.amount && userInput.amount !== "") {
      getCollateralRequired();
    }
  }, [userInput]);

  const getUserTokens = async () => {
    // Get from ERC721
    // Get from fractionalised
    setSelectedToken(tokensList[0].tokenId);
  };

  const approveFractionalised = async () => {
    console.log("Approve Called for Fractionalise!");
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "approve",
        props.signer,
        0,
        [FRACTIONALIZER_ADDRESS, selectedToken],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "success",
          });
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
        [selectedToken, new BN(100n * 1000_000_000_000n)],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "success",
          });
          getIsFractionalised();
          getUserFractionHolding();
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

  const isTokenIdApprovedForFractionalised = async () => {
    console.log("isTokenIdApprovedForFractionalised called");
    if (selectedToken === null) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getApproved",
        0,
        [selectedToken],
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

  const getIsFractionalised = async () => {
    if (selectedToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "isFractionalized",
        0,
        [selectedToken],
        (val) => {
          console.log("isFractionalised : ", val);
          setIsFractionalized(val.Ok == true);
        }
      ).catch((err) => {
        console.log("isFractionalised", err);
      });
    } catch (err) {
      console.log("isFractionalised", err);
    }
  };

  const handleUserInput = (e, key) => {
    setUserInput({
      ...userInput,
      [key]: e.target.value,
    });
  };

  const approveNftLending = async () => {
    console.log("approve nft lending called");
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "erc1155::setApprovalForAll",
        props.signer,
        0,
        [NFT_LENDING_ADDRESS, true],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "success",
          });
          isApprovedForNFT();
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

  const isApprovedForNFT = async () => {
    console.log("isApprovedForNFT called");
    if (selectedToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "erc1155::isApprovedForAll",
        0,
        [props.activeAccount.address, NFT_LENDING_ADDRESS],
        (val) => {
          console.log("isApprovedForAll : ", val);
          setIsApprovedNFTLending(val.Ok == true);
        }
      ).catch((err) => {
        console.log("isApprovedForAll", err);
      });
    } catch (err) {
      console.log("isApprovedForAll", err);
    }
  };

  const getUserFractionHolding = async () => {
    console.log("getUserFractionHolding called");
    if (selectedToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "erc1155::balanceOf",
        0,
        [props.activeAccount.address, selectedToken],
        (val) => {
          console.log("getUserFractionHolding : ", val);
          setUserHolding(val.Ok.replace(/,/g, ''));
        }
      ).catch((err) => {
        console.log("getUserFractionHolding", err);
      });
    } catch (err) {
      console.log("getUserFractionHolding", err);
    }
  };

  const getCollateralRequired = async () => {
    console.log("getCollateralRequired called");
    if (selectedToken === null) return false;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getCollateralRequired",
        0,
        [
          props.activeAccount.address,
          new BN(userInput.amount * 1000_000_000_000),
          userInput.duration * 86400,
        ],
        (val) => {
          console.log("getCollateralRequired : ", val);
          setCollateralRequired(val.Ok.replace(/,/g, ''));
        }
      ).catch((err) => {
        console.log("getCollateralRequired", err);
      });
    } catch (err) {
      console.log("getCollateralRequired", err);
    }
  };

  const create = async () => {
    console.log("Create called");
    if (userInput.amount === "" || !userInput.amount) {
      enqueueSnackbar("Ask amount cannot be empty", { variant: "warning" });
      return;
    }
    if (userInput.duration === "" || !userInput.duration) {
      enqueueSnackbar("Duration cannot be empty", { variant: "warning" });
      return;
    }
    if (!userInput || (userInput.fraction < 0 && userInput.fraction > 100)) {
      enqueueSnackbar("Fraction should be between 0 to 100", {
        variant: "warning",
      });
      return;
    }
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "listAdvertisement",
        props.signer,
        collateralRequired,
        [
          selectedToken,
          new BN(parseInt(userInput.fraction) * 1000_000_000_000),
          new BN(parseInt(userInput.amount) * 1000_000_000_000),
          userInput.duration * 86400,
        ],
        () => {
          enqueueSnackbar("Transaction Finalized", {
            variant: "success",
          });
          isApprovedForNFT();
          setUserInput({
            amount: "",
            duration: "",
            fraction: "",
          });
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

  useEffect(() => {
    console.log("isApproved", isApprovedFractionalizer, isApprovedNFTLending, collateralRequired);
  });

  return (
    <Box
      sx={{
        margin: "90px 0",
        display: "flex",
        justifyContent: "center",
        height: "fit-content",
        marginBottom: "200px",
      }}
    >
      <Box
        sx={{
          margin: "90x 0",
          minWidth: "300px",
          width: "70%",
          maxWidth: "700px",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
          }}
          variant="h5"
          textAlign={"center"}
        >
          Create a listing
        </Typography>
        <Box sx={{ width: "100%", marginTop: "60px" }}>
          <Box
            className="selectContainer"
            sx={{
              width: "100%",
              marginTop: "15px",
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
              onChange={(e) => handleTokenChange(e)}
            >
              {tokensList.map((token, idx) => (
                <option value={token.tokenId} key={idx}>
                  {"Token Id : " +
                    token.tokenId +
                    (token.fractionalized
                      ? " (Fractionalized) (Ownership " + token.ownership + ")"
                      : "")}
                </option>
              ))}
            </select>
          </Box>
          <Box sx={{ marginTop: "50px" }}>
            <Typography
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
              }}
              textAlign={"center"}
              variant="h6"
            >
              Fractionalise NFT
            </Typography>
            <Box
              sx={{
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "20px",
                  color: "#d1b473",
                }}
                variant={"subtitle1"}
              >
                Give contract access to fractionalise your NFT
              </Typography>
              <div
                className={
                  "btn " +
                  (isFractionalized || isApprovedFractionalizer
                    ? "btn-done"
                    : "btn-red")
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
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "20px",
                  color: "#d1b473",
                }}
                variant={"subtitle1"}
              >
                Fractionalise your selected NFT
              </Typography>
              <div
                className={
                  "btn " + (isFractionalized ? "btn-done" : "btn-green")
                }
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
                onClick={() => !isFractionalized && fractionaliseNFT()}
              >
                {isFractionalized ? "Fractionalised" : "Fractionalise"}
              </div>
            </Box>
          </Box>
          <Box sx={{ marginTop: "50px" }}>
            <Typography
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
                marginBottom: "30px",
              }}
              textAlign={"center"}
              variant="h6"
            >
              Fill details
            </Typography>
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
              <Box
                className="inputContainer"
                sx={{ width: "45%", marginTop: "15px", marginRight: "10%" }}
              >
                <label
                  className="inputLabel"
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    color: "gray",
                  }}
                >
                  {"Ask Amount (AZERO)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter ask amount"
                  value={userInput.amount}
                  onChange={(e) => handleUserInput(e, "amount")}
                />
              </Box>
              <Box
                className="inputContainer"
                sx={{ width: "45%", marginTop: "15px" }}
              >
                <label
                  className="inputLabel"
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    color: "gray",
                  }}
                >
                  {"Duration (in days)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter duration"
                  value={userInput.duration}
                  onChange={(e) => handleUserInput(e, "duration")}
                />
              </Box>
              <Box
                className="inputContainer"
                sx={{ width: "45%", marginTop: "15px" }}
              >
                <label
                  className="inputLabel"
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    color: "gray",
                  }}
                >
                  {"Fraction to put as collateral(%)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter fraction"
                  value={userInput.fraction}
                  onChange={(e) => handleUserInput(e, "fraction")}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    marginTop: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Ubuntu Condensed', sans-serif",
                      marginRight: "20px",
                      color: "#d1b473",
                    }}
                    variant={"subtitle1"}
                  >
                    Give contract access to operate on your fractionalised NFT
                  </Typography>
                  <div
                    className={
                      "btn " + (isApprovedNFTLending ? "btn-done" : "btn-red")
                    }
                    tabIndex={1}
                    style={{
                      fontFamily: "'Ubuntu Condensed', sans-serif",
                    }}
                    onClick={() => {
                      !isApprovedNFTLending && approveNftLending();
                    }}
                  >
                    {isApprovedNFTLending
                      ? "Approved for all"
                      : "Approve for all"}
                  </div>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    marginTop: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="btn btn-green"
                    tabIndex={1}
                    style={{
                      fontFamily: "'Ubuntu Condensed', sans-serif",
                    }}
                    onClick={() => create()}
                  >
                    Create
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
