import { Box } from "@mui/material";
import nft from "../assets/nft.avif";
export default function Card(props) {
  return (
    <Box
      sx={{
        height: "500px",
        width: "300px",
        padding: "20px",
        cursor: "pointer",
      }}
      className="cardShadow"
    >
      <Box className="card" sx={{ zIndex: "-1" }}>

      </Box>
    </Box>
  );
}
