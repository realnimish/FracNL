import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function StatusAndTimer(props) {
  const [timer, setTimer] = useState(props.time);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    console.log("Props: ", props.time, props.status);
    setTimer(props.time);
  }, [props.time]);

  return (
    <Box
      sx={{
        minWidth: "300px",
        width: "80%",
        maxWidth: "500px",
        margin: "70px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={"statusAndTimer"}
    >
      <Typography
        sx={{
          color: "black",
          fontFamily: "'Ubuntu Condensed', sans-serif",
          marginRight: "20px",
        }}
        variant={"h6"}
      >
        {props.status}
      </Typography>
      <Typography
        sx={{ color: "black", fontFamily: "'Ubuntu Condensed', sans-serif" }}
        variant={"subtitle1"}
        textAlign="center"
      >
        {parseInt(timer / 86400) +
          " days : " +
          parseInt((timer % 86400) / 3600) +
          " hours : " +
          parseInt(((timer % 86400) % 3600) / 60) +
          " minutes : " +
          parseInt(timer % 60) +
          " seconds "}
      </Typography>
    </Box>
  );
}
