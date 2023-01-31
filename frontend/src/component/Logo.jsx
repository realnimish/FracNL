import { Box, Typography } from "@mui/material";
import { height } from "@mui/system";
import "../index.css";
export default function logo(props) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "fit-content",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontFamily: "'Carter One', cursive" }}
        className="colorChanger"
      >
        F
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          position: "absolute",
          top: " 28px",
          left: "-10px",
          background: "#03080f",
          fontFamily: "'Carter One', cursive",
          height: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        FracNL
      </Typography>
    </Box>
  );
}
