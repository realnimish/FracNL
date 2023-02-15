import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Card from "./CardComponent";
import Banner from "./Banner";
import { makeQuery } from "../commons";
export default function Homepage(props) {
  const [listings, setListings] = useState([
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
    {
      createAddress: "5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG",
      image:
        "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000",
      askValue: "300 ETH",
      duration: "7d",
      fraction: "30%",
      status: 0,
    },
  ]);
  // Create a new state to get nonce
  const [loanNonce, setLoanNonce] = useState(0);

  const getLoanNonce = async () => {
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanNonce",
        0,
        [],
        (val) => {
          console.log("Loan nonce: ", val);
          setLoanNonce(parseInt(val.Ok));
        }
      ).catch((err) => {
        console.log("getLoanNonce", err);
      })
    } catch (err) {
      console.log("getLoanNonce", err);
    }
  };

  useEffect(() => {
    getLoanNonce();
    const interval = setInterval(() => getLoanNonce(), 20000);
    return () => clearInterval(interval);
  }, [props.activeAccount])

  return (
    <Box sx={{ padding: "80px 0px", minHeight: "100%", height: "fit-content" }}>
      <Banner />
      <Box
        sx={{
          margin: "80px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            marginBottom: "90px",
          }}
          variant="h4"
        >
          Listings
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {// loop through an array of length nonce and idx in reverse
            new Array(loanNonce).fill(0).map((val, idx) => 
            <BoxComponent 
              idx={idx} 
              loanNonce={loanNonce} 
              activeAccount={props.activeAccount}
              contracts={props.contracts}
              api={props.api}
              signer={props.signer} />)
          }
        </Box>
      </Box>
    </Box>
  );
}

const BoxComponent = (props) => {

  let loanId = props.loanNonce - props.idx;
  const [tokenUri, setTokenUri] = useState("");
  const [loanMetadata, setLoanMetadata] = useState({
    borrower: "",
    tokenId: null,
    sharesLocked: "0",
    amountAsked: "0",
    securityDeposit: "0",
    loanPeriod: "0 days",
    listingTimestamp: new Date(),
  });
  const [loanStats, setLoanStats] = useState("");

  const [status, setStatus] = useState("");

  const loanStatus = {
    cancelled: "CANCELLED",
    open: "OPEN",
    active: "ACTIVE",
    closed: "CLOSED",
  };

  const getStatus = () => {
    if(loanStats) {
      if (loanStats == loanStatus.cancelled) {
        setStatus("CANCELLED");
      } else if (loanStats == loanStatus.closed) {
        setStatus("CLOSED");
      } else if (loanStats == loanStatus.active) {
        setStatus("ACTIVE");
      } else  {
        setStatus("OPEN");
      }
    } 
  }

  // Fetch function here
  const getTokenURI = async () => {
    if (!loanMetadata.tokenId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getTokenUri",
        0,
        [loanMetadata.tokenId],
        (val) => {
          console.log("getTokenURI : ", val);
          setTokenUri(val.Ok);
        }
      ).catch((err) => {
        console.log("getTokenURI", err);
      });
    } catch (err) {
      console.log("getTokenURI", err);
    }
  };

  const getLoanMetadata = async (loanId) => {
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanMetadata",
        0,
        [loanId],
        (val) => {
          console.log("getLoanMetadata : ", val);
          let data = val.Ok.Ok;
          setLoanMetadata({
            borrower: data.borrower,
            tokenId: data.tokenId,
            sharesLocked: parseInt(data.sharesLocked.replace(/,/g, "") / 1000_000),
            amountAsked: parseInt(data.amountAsked.replace(/,/g, "") / 1000_000) / 1000_000,
            securityDeposit: parseInt(data.securityDeposit.replace(/,/g, "") / 1000_000) / 1000_000,
            loanPeriod: parseInt(data.loanPeriod.replace(/,/g, "") / 86400000),
            listingTimestamp: new Date(
              parseInt(data.listingTimestamp.replace(/,/g, ""))
            ),
          });
        }
      ).catch((err) => {
        console.log("getLoanMetadata", err);
      });
    } catch (err) {
      console.log("getLoanMetadata", err);
    }
  };

  const getLoanStats = async (loanId) => {
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanStats",
        0,
        [loanId],
        (val) => {
          console.log("getLoanStats : ", val);
          let data = val.Ok.Ok;
          setLoanStats(data.loanStatus);
        }
      ).catch((err) => {
        console.log("getLoanStats", err);
      });
    } catch (err) {
      console.log("getLoanStats", err);
    }
  };

  // useEffect
  useEffect(() => {
    getTokenURI();
  }, [loanMetadata.tokenId]);

  useEffect(() => {
    getLoanMetadata(loanId);
    getLoanStats(loanId);
  }, [loanId]);

  useEffect(() => {
    getStatus();
  }, [loanStats])

  return (
    <Box sx={{ margin: "0 20px 60px 20px" }} key={props.idx}>
      <Card
        creatorAddress={loanMetadata.borrower}
        image={"https://ipfs.io/ipfs/" + tokenUri }
        askValue={loanMetadata.amountAsked + " TZERO"}
        duration={loanMetadata.loanPeriod + " Day(s)"}
        fraction={loanMetadata.sharesLocked / 1000_000 + "%"}
        status={status}
        link={"/listing/"+props.loanId}
      />
    </Box>
  );

}
