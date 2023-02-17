import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cutAddress, makeQuery, makeTransaction } from "../../commons";
import CreateOffer from "./CreateOffer";
import Offers from "./Offers";
import Repay from "./Repay";
import StatusAndTimer from "./StatusAndTimer";
import { useSnackbar } from "notistack";

export default function ListingDetail(props) {
  const { id } = useParams();
  const loanStatus = {
    cancelled: "CANCELLED",
    open: "OPEN",
    active: "ACTIVE",
    closed: "CLOSED",
  };
  const { enqueueSnackbar } = useSnackbar();
  const [listingDetails, setListingDetails] = useState({
    creatorAddress: "",
    askAmount: "0",
    holding: "0",
    duration: "0",
    securityDeposit: "0",
    listingDate: new Date(),
    tokenId: null,
  });

  const [loanStats, setLoanStats] = useState({
    startTimestamp: null,
    raised: "0",
    limitLeft: "0",
    interest: "0",
    repaid: "0",
    loanStatus: "OPEN",
  });

  const [totalSupply, setTotalSuppy] = useState(100_000_000);

  const [amountAccepted, setAmountAccepted] = useState(0);

  const [interestRate, setInterestRate] = useState(0);

  const [imageUrl, setImageUrl] = useState(
    "bafybeigibdc4ee4kgnpyfdx4r5k6fcyxtdhv73zmzobrab4rkcueoywcsm/mftimg1.png"
  );

  const [status, setStatus] = useState("");

  const [countDown, setCountDown] = useState(0);

  const [score, setScore] = useState(0);

  const getLoanMetadata = async () => {
    if (!id) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanMetadata",
        0,
        [id],
        (val) => {
          console.log("getLoanMetadata : ", val);
          let data = val.Ok.Ok;
          setListingDetails({
            creatorAddress: data.borrower,
            askAmount:
              parseInt(data.amountAsked.replace(/,/g, "") / 1000_000) /
              1000_000,
            holding: parseInt(data.sharesLocked.replace(/,/g, "") / 1000_000),
            securityDeposit:
              parseInt(data.securityDeposit.replace(/,/g, "") / 1000_000) /
              1000_000,
            listingDate: new Date(
              parseInt(data.listingTimestamp.replace(/,/g, ""))
            ),
            duration: data.loanPeriod.replace(/,/g, "") / 86400 / 1000,
            tokenId: data.tokenId,
          });
        }
      ).catch((err) => {
        console.log("getLoanMetadata", err);
      });
    } catch (err) {
      console.log("getLoanMetadata", err);
    }
  };

  const getTotalSupply = async () => {
    // if(!id || !listingDetails.tokenId) return;
    // try {
    //   await makeQuery(
    //     props.api,
    //     props.contracts,
    //     props.activeAccount,
    //     "fractionalizer",
    //     "tokenSupply",
    //     0,
    //     [listingDetails.tokenId],
    //     (val) => {
    //       console.log("getTotalSupply : ", val);
    //       setTotalSuppy(val.Ok.replace(/,/g, "")/1000_000)
    //     }
    //   ).catch((err) => {
    //     console.log("getTotalSupply", err);
    //   });
    // } catch (err) {
    //   console.log("getTotalSupply", err);
    // }
  };

  const getLoanStats = async () => {
    if (!id) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanStats",
        0,
        [id],
        (val) => {
          console.log("getLoanStats : ", val);
          let data = val.Ok.Ok;
          setLoanStats({
            startTimestamp: data.startTimestamp
              ? parseInt(data.startTimestamp?.replace(/,/g, ""))
              : null,
            loanStatus: data.loanStatus,
            raised:
              parseInt(data.raised.replace(/,/g, "") / 1000_000) / 1000_000,
            repaid:
              parseInt(data.repaid.replace(/,/g, "") / 1000_000) / 1000_000,
            interest:
              parseInt(data.interest.replace(/,/g, "") / 1000_000) / 1000_000,
          });
          setAmountAccepted(
            parseInt(data.raised.replace(/,/g, "") / 1000_000) / 1000_000
          );
        }
      ).catch((err) => {
        console.log("getLoanStats", err);
      });
    } catch (err) {
      console.log("getLoanStats", err);
    }
  };

  const getCreditScore = async () => {
    if (!listingDetails.creatorAddress) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getCreditScore",
        0,
        [listingDetails.creatorAddress],
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

  const getTokenURI = async () => {
    if (!listingDetails.tokenId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getTokenUri",
        0,
        [listingDetails.tokenId],
        (val) => {
          console.log("getTokenURI : ", val);
          setImageUrl(val.Ok);
        }
      ).catch((err) => {
        console.log("getTokenURI", err);
      });
    } catch (err) {
      console.log("getTokenURI", err);
    }
  };

  const startLoan = async () => {
    if (!id) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "startLoan",
        props.signer,
        0,
        [id],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          getLoanStats();
          getCreditScore();
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

  const cancelLoan = async () => {
    if (!id) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "cancelLoan",
        props.signer,
        0,
        [id],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          getLoanStats();
          getCreditScore();
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

  const claimLoanDefault = async () => {
    if (!id) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "claimLoanDefault",
        props.signer,
        0,
        [id],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          getLoanStats();
          getCreditScore();
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

  const getStatus = () => {
    if (
      listingDetails.duration &&
      listingDetails.listingDate.getTime() &&
      loanStats.loanStatus
    ) {
      let duration = listingDetails.duration * 86400000;
      let listingTime = listingDetails.listingDate.getTime();
      let offerPhase = 3600000;
      let coolDownPeriod = 360000;
      let startTime = loanStats.startTimestamp;
      let now = Date.now();
      if (loanStats.loanStatus == loanStatus.cancelled) {
        setStatus("Cancelled");
        setCountDown(0);
      } else if (loanStats.loanStatus == loanStatus.closed) {
        setStatus("Closed");
        setCountDown(0);
      } else if (loanStats.loanStatus == loanStatus.active) {
        setStatus("Active");
        setCountDown(duration - (now - startTime));
      } else if (now - listingTime <= offerPhase) {
        setStatus("Offer Phase");
        setCountDown(offerPhase - (now - listingTime));
      } else if (
        now - listingTime > offerPhase &&
        now - listingTime <= offerPhase + coolDownPeriod
      ) {
        setStatus("Cooldown Phase");
        setCountDown(coolDownPeriod - (now - listingTime - offerPhase));
      } else if (
        now - listingTime > offerPhase + coolDownPeriod &&
        loanStats.loanStatus == loanStatus.open
      ) {
        setStatus("Pending action");
        setCountDown(0);
      }
    }
  };

  useEffect(() => {
    getLoanMetadata();
    getLoanStats();
    const interval = setInterval(() => getLoanStats(), 20000);
    return () => clearInterval(interval);
  }, [id, props.activeAccount]);

  useEffect(() => {
    getTotalSupply();
    getTokenURI();
  }, [listingDetails.tokenId]);

  useEffect(() => {
    if (
      loanStats &&
      loanStats.interest &&
      loanStats.raised != 0
    ) {
        setInterestRate(
          (parseFloat(loanStats.interest) / parseFloat(loanStats.raised)) * 100
        );
    }
  }, [loanStats.raised, loanStats.interest]);

  useEffect(() => {
    getCreditScore();
  }, [listingDetails.creatorAddress]);

  useEffect(() => {
    getStatus();
  }, [listingDetails, loanStats]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      className="listingDetail"
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
        <>
          <StatusAndTimer status={status} time={countDown / 1000} />
          <Box className="detailBox">
            <Box className="detailBoxLeft">
              <img
                src={"https://ipfs.io/ipfs/" + imageUrl}
                className="detailImage"
              />
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", color: "gray" }}
              >
                Owner Address :{" "}
              </Typography>
              <Link
                to={"/profile/" + listingDetails.creatorAddress}
                style={{ color: "white" }}
              >
                <Typography
                  variant="h6"
                  sx={{ marginTop: "5px", textShadow: "0px 2px 3px white" }}
                >
                  {cutAddress(listingDetails.creatorAddress, 10, 11)}
                </Typography>
              </Link>
            </Box>
            <Box className="detailBoxRight">
              <Box
                sx={{ width: "50%", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Ask Amount :{" "}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "5px" }}>
                  {listingDetails.askAmount + " TZERO"}
                </Typography>
              </Box>
              <Box
                sx={{ width: "50%", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Amount Accepted :{" "}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "5px" }}>
                  {amountAccepted + " TZERO"}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Fraction :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {totalSupply > 0
                    ? (listingDetails.holding / totalSupply) * 100 + "%"
                    : " --- "}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Loan duration :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {listingDetails.duration + " Day(s)"}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Owner credit score :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {score}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Security deposit :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {listingDetails.securityDeposit + " TZERO"}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Avg Interest Rate :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {parseFloat(interestRate).toPrecision(6) + "%"}
                </Typography>
              </Box>
              <Box
                sx={{ width: "150px", height: "fit-content" }}
                className="detailItem"
              >
                <Typography
                  variant="body2"
                  sx={{ marginTop: "20px", color: "gray" }}
                >
                  Listing Date :{" "}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  {listingDetails.listingDate.toDateString()}
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }} className="buttonContainer">
                {loanStats.loanStatus == loanStatus.open &&
                  listingDetails.creatorAddress ===
                    props.activeAccount.address && (
                    <div
                      className="btn btn-green"
                      tabIndex={1}
                      style={{
                        fontFamily: "'Ubuntu Condensed', sans-serif",
                        marginRight: "40px",
                      }}
                      onClick={() => startLoan()}
                    >
                      Start Loan
                    </div>
                  )}
                {loanStats.loanStatus == loanStatus.open && (
                  <div
                    className="btn btn-red"
                    tabIndex={1}
                    style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
                    onClick={() => cancelLoan()}
                  >
                    Cancel Loan
                  </div>
                )}
                {loanStats.loanStatus == loanStatus.active &&
                  loanStats.startTimestamp &&
                  loanStats.startTimestamp +
                    86400000 * listingDetails.duration <
                    Date.now() && (
                    <div
                      className="btn btn-red"
                      tabIndex={1}
                      style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
                      onClick={() => claimLoanDefault()}
                    >
                      Claim Loan Default
                    </div>
                  )}
              </Box>
            </Box>
          </Box>
          {["ACTIVE", "CLOSED", "CANCELLED"].includes(loanStats.loanStatus) && (
            <Repay
              listingDetails={listingDetails}
              loanStats={loanStats}
              id={id}
              activeAccount={props.activeAccount}
              contracts={props.contracts}
              api={props.api}
              signer={props.signer}
              getLoanStats={() => getLoanStats()}
            />
          )}
          {props.activeAccount.address !== listingDetails.creatorAddress && (
            <CreateOffer
              listingDetails={listingDetails}
              loanStats={loanStats}
              id={id}
              activeAccount={props.activeAccount}
              contracts={props.contracts}
              api={props.api}
              signer={props.signer}
            />
          )}
          <Offers
            listingDetails={listingDetails}
            loanStats={loanStats}
            activeAccount={props.activeAccount}
            contracts={props.contracts}
            api={props.api}
            signer={props.signer}
            id={id}
          />
        </>
      )}
    </Box>
  );
}
