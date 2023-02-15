import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Card from "./CardComponent";
import Banner from "./Banner";
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
          // new Array(nonce).fill(0).map((val, idx) => { loanId = nonce - idx; return (Box);})
          listings.map((listing, idx) => {
            // states
            // fetch tokenUri
            // fetch loanMetadata
            // fetch loan stats
            return (
              <Box sx={{ margin: "0 20px 60px 20px" }} key={idx}>
                <Card
                  creatorAddress={listing.createAddress}
                  image={listing.image}
                  askValue={listing.askValue}
                  duration={listing.duration}
                  fraction={listing.fraction}
                  status={listing.status}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
