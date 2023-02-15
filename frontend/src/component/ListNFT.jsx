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
import { useNavigate } from "react-router-dom";

export default function ListNFT(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isApprovedFractionalizer, setIsApprovedFractionalizer] =
    useState(false);
  const [isApprovedNFTLending, setIsApprovedNFTLending] = useState(false);
  const [collateralRequired, setCollateralRequired] = useState(0);
  const [isFractionalized, setIsFractionalized] = useState(false);
  const [tokensList, setTokensList] = useState([
    {
      tokenId: null,
      fractionalized: false,
      ownership: "100%",
    },
  ]);
  const [ercTokens, setErcTokens] = useState([]);
  const navigate = useNavigate();
  const [fracTokens, setFracTokens] = useState([]);
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
    props.activeAccount && getUserTokens();
  }, [props.activeAccount]);

  useEffect(() => {
    getIsFractionalised();
    isTokenIdApprovedForFractionalised();
    isApprovedForNFT();
    getUserFractionHolding();
  }, [selectedToken]);

  useEffect(() => {
    let erc = ercTokens.map((token) => {
      return {
        tokenId: token,
        fractionalized: false,
        ownership: "100%",
      };
    });

    let frac = fracTokens.map((token) => {
      return {
        tokenId: token[0],
        fractionalized: true,
        ownership:
          (token[1].replace(/,/g, "") * 100) / token[2].replace(/,/g, "") + "%",
      };
    });

    console.log("List ", erc, frac);
    setTokensList([
      {
        tokenId: null,
        fractionalized: false,
        ownership: "100%",
      },
      ...erc,
      ...frac,
    ]);
  }, [ercTokens, fracTokens]);

  useEffect(() => {
    if (
      userInput.duration &&
      userInput.duration !== "" &&
      userInput.amount &&
      userInput.amount !== ""
    ) {
      getCollateralRequired();
    }
  }, [userInput]);

  const getUserTokens = async () => {
    try {
      // Get from ERC721
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getUserTokens",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens erc : ", val);
          setErcTokens(val.Ok);
        }
      ).catch((err) => {
        console.log("getUserTokens erc", err);
      });
      // Get from fractionalised
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "getUserHoldings",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens frac : ", val);
          setFracTokens(val.Ok);
        },
        (val) => {
          console.log("Error on getUserTokens frac", val);
        }
      ).catch((err) => {
        console.log("getUserTokens frac", err);
      });
    } catch (err) {
      console.log("getUserTokens", err);
    }
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
          setUserHolding(val.Ok.replace(/,/g, ""));
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
          new BN(parseInt(userInput.amount * 1000) * 1000_000_000),
          new BN(parseInt(userInput.duration * 1000) * 86400),
        ],
        (val) => {
          console.log("getCollateralRequired : ", val);
          setCollateralRequired(val.Ok.replace(/,/g, ""));
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
        collateralRequired.replace(/,/g, ""),
        [
          selectedToken,
          new BN(parseInt(userInput.fraction * 1000) * 1000_000_000),
          new BN(parseInt(userInput.amount) * 1000_000_000_000),
          new BN(parseInt(userInput.duration * 1000) * 86400),
        ],
        (val) => {
          // enqueueSnackbar(
          //   <span
          //     onClick={() =>
          //       navigate("/canvas/" + val.contractEvents[0].args[0].toHuman())
          //     }
          //     style={{ textDecoration: "none", color: "white" }}
          //   >
          //     {" Transaction Finalized, Click to go to ad details #" +
          //       val.contractEvents[0].args[0].toHuman()}
          //   </span>,
          //   {
          //     variant: "success",
          //   }
          // );
          enqueueSnackbar("Transaction Finalized", {variant: "success"});
          isApprovedForNFT();
          setUserInput({
            amount: "",
            duration: "",
            fraction: "",
          });
          setSelectedToken(null);
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

  // useEffect(() => {
  //   console.log(
  //     "isApproved",
  //     isApprovedFractionalizer,
  //     isApprovedNFTLending,
  //     collateralRequired,
  //     tokensList
  //   );
  // });

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
      {!props.activeAccount ? (
        <Box
          sx={{
            marginTop: "200px",
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
                        ? " (Fractionalized) (Ownership " +
                          token.ownership +
                          ")"
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
                  <Typography textAlign={"center"} sx={{marginTop: "20px", color: "gray"}}>
                    {"Collateral required: " + collateralRequired/1000_000_000_000 + "TZERO"}
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
      )}
    </Box>
  );
}
