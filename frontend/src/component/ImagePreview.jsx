import { Box, Typography } from "@mui/material";
import nft from "../assets/nft.avif";
import { cutAddress } from "../commons";
import CircleIcon from "@mui/icons-material/Circle";
export default function ImagePreview(props) {

  return (
    <Box
      sx={{
        height: "500px",
        width: "400px",
        padding: "20px",
        cursor: "pointer",
        borderRadius: "50px",
        marginRight: "30px",
      }}
      tabIndex={1}
      className="card"
    >
      <Box
        sx={{
          height: "400px",
          width: "200px",
          borderRadius: "50px",
          position: "absolute",
          top: "0",
          right: "0",
          padding: "20px",
        }}
        className="cardClone"
      ></Box>
      <img
        src={props.image}
        style={{ width: "100%", borderRadius: "30px", marginBottom: "15px" }}
      />
    </Box>
  );
}
