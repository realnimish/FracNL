import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { cutAddress } from "../../commons";
import CreateOffer from "./CreateOffer";
import Offers from "./Offers";
import Repay from "./Repay";
import StatusAndTimer from "./StatusAndTimer";

export default function ListingDetail(props) {
  const [listingDetails, setListingDetails] = useState({
    image:
      "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
    creatorAddress: "GCNGuw8AKfwuvdFmSKQfS6dMADgRounXRs5cSDq1TXACxQM",
    askAmount: "500 ETH",
    fraction: "30%",
    duration: "30d",
    interest: "200% APY",
    score: "303",
    securityDeposit: "10 ETH",
    acceptedAmount: "350 ETH",
  });

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
      <StatusAndTimer status="Execution Phase " time={"78393"} />
      <Box className="detailBox">
        <Box className="detailBoxLeft">
          <img src={listingDetails.image} className="detailImage" />
          <Typography variant="body2" sx={{ marginTop: "20px", color: "gray" }}>
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
              {listingDetails.acceptedAmount}
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
              {listingDetails.fraction}
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
              {listingDetails.score}
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
              {listingDetails.interest}
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
              {"13/ 03/ 2000"}
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
    </Box>
  );
}
