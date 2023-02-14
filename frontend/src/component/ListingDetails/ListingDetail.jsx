import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cutAddress, makeQuery } from "../../commons";
import CreateOffer from "./CreateOffer";
import Offers from "./Offers";
import Repay from "./Repay";
import StatusAndTimer from "./StatusAndTimer";

export default function ListingDetail(props) {
  const { id } = useParams();

  const [listingDetails, setListingDetails] = useState({
    creatorAddress: "",
    askAmount: "0 ETH",
    holding: "0",
    duration: "0d",
    securityDeposit: "0 ETH",
    listingDate: new Date(),
    tokenId: null,
  });

  const [loanStats, setLoanStats] = useState({
		"startTimestamp": null,
		"raised": "0",
		"limitLeft": "0",
		"interest": "0",
		"repaid": "0",
		"loanStatus": "OPEN"
	});

  const [totalSupply, setTotalSuppy] = useState(1);

  const [amountAccepted, setAmountAccepted] = useState(0);

  const [interestRate, setInterestRate] = useState(0);

  const [imageUrl, setImageUrl] = useState(
    "bafybeigibdc4ee4kgnpyfdx4r5k6fcyxtdhv73zmzobrab4rkcueoywcsm/mftimg1.png"
  );

  const [score, setScore] = useState(0);

  const [offers, setOffers] = useState([
    {
      lenderAddress: "5EZb1KFFkvZC2HiJrPj81TuUg1hEwQ1FMS2D5t8XrR4dYnbz",
      amount: "500 ETH",
      interest: "50% APY",
    },
    {
      lenderAddress: "5EZb1KFFkvZC2HiJrPj81TuUg1hEwQ1FMS2D5t8XrR4dYnbz",
      amount: "500 ETH",
      interest: "50% APY",
    },
    {
      lenderAddress: "5EZb1KFFkvZC2HiJrPj81TuUg1hEwQ1FMS2D5t8XrR4dYnbz",
      amount: "500 ETH",
      interest: "50% APY",
    },
    {
      lenderAddress: "5EZb1KFFkvZC2HiJrPj81TuUg1hEwQ1FMS2D5t8XrR4dYnbz",
      amount: "500 ETH",
      interest: "50% APY",
    },
    {
      lenderAddress: "5EZb1KFFkvZC2HiJrPj81TuUg1hEwQ1FMS2D5t8XrR4dYnbz",
      amount: "500 ETH",
      interest: "50% APY",
    },
  ]);

  const getLoanMetadata = async () => {
    if(!id) return;
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
            askAmount: parseInt(data.amountAsked.replace(/,/g, "")/1000_000)/1000_000 + " TZERO",
            holding: parseInt(data.sharesLocked.replace(/,/g, "")/ 1000_000),
            securityDeposit: parseInt(data.securityDeposit.replace(/,/g,"")/1000_000)/1000_000 + " TZERO" ,
            listingDate: new Date(parseInt(data.listingTimestamp.replace(/,/g, ""))),
            duration: parseInt(data.loanPeriod.replace(/,/g, "")/86400)/1000 + " Day(s)",
            tokenId: data.tokenId,
          });
        }
      ).catch((err) => {
        console.log("getLoanMetadata", err);
      });
    } catch (err) {
      console.log("getLoanMetadata", err);
    }
  }

  const getTotalSupply = async () => {
    if(!id || !listingDetails.tokenId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "tokenSupply",
        0,
        [listingDetails.tokenId],
        (val) => {
          console.log("getTotalSupply : ", val);
          setTotalSuppy(val.Ok.replace(/,/g, "")/1000_000)
        }
      ).catch((err) => {
        console.log("getTotalSupply", err);
      });
    } catch (err) {
      console.log("getTotalSupply", err);
    }
  }

  const getLoanStats = async () => {
    if(!id) return;
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
            startTimestamp: parseInt(data.startTimestamp.replace(/,/g, "")),
            loanStatus: data.loanStatus,
            raised: parseInt(data.raised.replace(/,/g, "")/1000_000)/1000_000,
            repaid: parseInt(data.repaid.replace(/,/g, "")/1000_000)/1000_000,
            interest: parseInt(data.interest.replace(/,/g, "")/1000_000)/1000_000,
          });
          setAmountAccepted(parseInt(data.raised.replace(/,/g, "")/1000_000)/1000_000)
        }
      ).catch((err) => {
        console.log("getLoanStats", err);
      });
    } catch (err) {
      console.log("getLoanStats", err);
    }
  }

  const getCreditScore = async () => {
    if(!listingDetails.creatorAddress) return;
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
  }

  const getTokenURI = async () => {
    if(!listingDetails.tokenId) return;
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
  }

  useEffect(() => {
    getLoanMetadata();
    getLoanStats();
  }, [id, props.activeAccount]);

  useEffect(() => {
    getTotalSupply();
    getTokenURI();
  }, [listingDetails.tokenId]);

  useEffect(() => {
    if(listingDetails.askAmount && loanStats.interest) {
      setInterestRate(((parseFloat(loanStats.interest)/parseFloat(listingDetails.askAmount))*100) + "%")
    }
  }, [listingDetails.askAmount, loanStats.interest]);


  useEffect(() => {
    getCreditScore();
  },[listingDetails.creatorAddress]);

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
          <StatusAndTimer status="Execution Phase " time={"78393"} />
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
              <Typography
                variant="h6"
                sx={{ marginTop: "5px", textShadow: "0px 2px 3px white" }}
              >
                {cutAddress(listingDetails.creatorAddress, 10, 11)}
              </Typography>
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
                  {listingDetails.askAmount}
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
                  {totalSupply > 0 ? listingDetails.holding/totalSupply * 100 + "%" : " --- "}
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
                  {listingDetails.duration}
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
                  {listingDetails.securityDeposit}
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
                  {interestRate}
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
                <div
                  className="btn btn-green"
                  tabIndex={1}
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    marginRight: "40px",
                  }}
                >
                  Accept
                </div>
                <div
                  className="btn btn-red"
                  tabIndex={1}
                  style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
                >
                  Reject
                </div>
              </Box>
            </Box>
          </Box>
          <Repay />
          <CreateOffer />
          <Offers offers={offers} />
        </>
      )}
    </Box>
  );
}
