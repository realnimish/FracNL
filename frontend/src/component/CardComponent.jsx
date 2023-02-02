import { Box, Typography } from "@mui/material";
import nft from "../assets/nft.avif";
import { cutAddress } from "../commons";
export default function Card(props) {
  const TextRow = (props) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            margin: "5px 0",
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1px",
            width: "50%",
            color: "#878585",
          }}
        >
          {props.title}
        </Typography>
        <Typography
          sx={{
            margin: "5px 0",
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1px",
            width: "50%",
            color: "#e6e6e6",
          }}
        >
          {props.value}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: "500px",
        width: "300px",
        padding: "20px",
        cursor: "pointer",
        borderRadius: "50px",
      }}
      tabIndex={1}
      className="card"
    >
      <Box
        sx={{
          height: "500px",
          width: "300px",
          borderRadius: "50px",
          position: "absolute",
          top: "0",
          right: "0",
          padding: "20px",
        }}
        className="cardClone"
      ></Box>
      <img src={props.image} style={{ width: "100%", borderRadius: "30px", marginBottom: "15px" }} />
      <TextRow title={"Asker Address :"} value={cutAddress(props.creatorAddress, 7, 6)}/>
      <TextRow title={"Ask Amount :"} value={props.askValue}/>
      <TextRow title={"NFT Fraction :"} value={props.fraction}/>
      <TextRow title={"Duration :"} value={props.duration}/>
    </Box>
  );
}
