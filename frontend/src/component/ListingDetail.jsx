import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { cutAddress } from "../commons";

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
  });
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
            sx={{ width: "100%", height: "fit-content" }}
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
              Interest Rate :{" "}
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
          <Box sx={{ width: "100%" }} className="buttonContainer">
            <div
              className="btn btn-green"
              tabIndex={1}
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                marginRight: "30px",
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
      <Box className="offers">
        <Typography
          className="title"
          sx={{ fontFamily: "'Ubuntu Condensed', sans-serif", letterSpacing:"1.5px", margin: "0px 0px 30px 0px" }}
          variant="h5"
        >
          Offers
        </Typography>
        <Box className="offer">
        </Box>
      </Box>
    </Box>
  );
}
