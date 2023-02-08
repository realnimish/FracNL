import { Box, Button, TextField, Typography } from "@mui/material";
import Identicon from "@polkadot/react-identicon";
import { useState } from "react";
import { cutAddress } from "../commons";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export default function ListingDetail(props) {
  const Status = {
    pending: {
      color: "gray",
      text: "PENDING",
    },
    accepted: {
      color: "#69c46d",
      text: "ACCEPTED",
    },
    rejected: {
      color: "#f47068",
      text: "REJECTED",
    },
  };
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
              Amount Accepted :{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {listingDetails.acceptedAmount}
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
      <Box className="repay">
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 30px 0px",
          }}
          variant="h5"
        >
          Repay
        </Typography>
        <Box className="repayContainer">
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
              {"Amount (TZERO)"}
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter repayment amount"
            />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
          >
            <Box sx={{ width: "100%", display: "flex" }}>
              <div
                className="btn btn-blue"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
              >
                Repay
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="createOffer">
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 30px 0px",
          }}
          variant="h5"
        >
          Your Offer
        </Typography>
        <Box className="createOfferContainer">
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
              {"Amount (TZERO)"}
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter lending amount"
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
              Interest Rate (%)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter interest rate"
            />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
          >
            <Box sx={{ width: "100%", display: "flex" }}>
              <div
                className="btn btn-green"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "40px",
                }}
              >
                Edit
              </div>
              <div
                className="btn btn-red"
                tabIndex={1}
                style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
              >
                Withdraw
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="offers">
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 30px 0px",
          }}
          variant="h5"
        >
          Offers
        </Typography>
        <Box className="offer">
          <Identicon
            size={40}
            theme={"polkadot"}
            value={offers[0].lenderAddress}
            style={{ margin: "5px 0", marginRight: "40px" }}
          />
          <Box
            sx={{
              minWidth: "300px",
              width: "70%",
              display: "flex",
              flexDirection: "column",
              margin: "5px 0",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
            >
              <Typography
                variant="subtitle2"
                sx={{ marginRight: "10px", color: "gray" }}
              >
                Lender Address :
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#b1b1b1" }}>
                {cutAddress(offers[0].lenderAddress, 15, 15)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: "50%", color: "gray" }}
              >
                {"Lend Amount : "}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ width: "50%", color: "gray" }}
              >
                {"Interest Rate : "}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ width: "50%" }}>
                {offers[0].amount}
              </Typography>
              <Typography variant="h6" sx={{ width: "50%" }}>
                {offers[0].interest}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px 0",
            }}
          >
            {false ? (
              <Typography variant="body1" sx={{ color: Status.accepted.color }}>
                {Status.accepted.text}
              </Typography>
            ) : (
              <>
                <Box className="offerAcceptBtn" tabIndex={1}>
                  <DoneIcon className="greenColor" />
                </Box>
                <Box className="offerRejectBtn" tabIndex={1}>
                  <CloseIcon className="redColor" />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
