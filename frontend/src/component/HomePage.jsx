import { Box, Typography } from "@mui/material";
import Card from "./CardComponent";
export default function Homepage(props) {
  return (
    <Box sx={{ padding: "80px", minHeight: "100%", height: "fit-content" }}>
      <Typography
        variant="h6"
        sx={{ fontFamily: "'Ubuntu Condensed', sans-serif", margin: "20px 0" }}
      >
        List
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Card
          creatorAddress={"5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG"}
          image={
            "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000"
          }
          askValue={"1200$"}
          duration={"7d"}
          fraction={"90%"}
        />
        <Card
          creatorAddress={"5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG"}
          image={
"https://www.cnet.com/a/img/resize/e547a2e4388fcc5ab560f821ac170a59b9fb0143/hub/2021/12/13/d319cda7-1ddd-4855-ac55-9dcd9ce0f6eb/unnamed.png?auto=webp&fit=crop&height=1200&width=1200"          }      
          askValue={"1200$"}
          duration={"7d"}
          fraction={"90%"}
        />
        <Card
          creatorAddress={"5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG"}
          image={
"https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149611030.jpg?w=2000"          }
          askValue={"1200$"}
          duration={"7d"}
          fraction={"90%"}
        />
      </Box>
    </Box>
  );
}
