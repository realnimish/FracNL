import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Profile(props) {
  return (
    <Box
      component="div"
      sx={{
        marginTop: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          textAlign={"center"}
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 0px 0px",
          }}
        >
          Profile
        </Typography>
      </Box>
      <Box>
      <Typography
          variant="h5"
          textAlign={"center"}
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 0px 0px",
          }}
        >
          Created Ads
        </Typography>
      </Box>
    </Box>
  );
}
