import { Paper, Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import Card from "./CardComponent";

export default function CarouselItem(props) {
  return (
    <Card
      creatorAddress={"5Gs5gfzHkBsRt97qgmvBW2qX6M7FPXP8cJkAj7T7kNFbGVvG"}
      image={
        "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149611030.jpg?w=2000"
      }
      askValue={"1200$"}
      duration={"7d"}
      fraction={"90%"}
      status={2}
    />
  );
}
