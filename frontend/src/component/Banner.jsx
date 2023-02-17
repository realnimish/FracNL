import { Box, Typography } from "@mui/material";

export default function Banner(props) {
  return (
    <Box
      className="mainContainer"
      sx={{ margin: "50px 0 100px 0", height: "700px", width: "100%" }}
    >
      <Box className="bannerText">
        <Typography
          sx={{
            position: "absolute",
            zIndex: "999",
            fontSize: "3rem",
            fontWeight: "600",
            background: "#ffffff26",
            boxShadow: "0px 0px 5px 5px #ffffff2e",
            textShadow: "2px 4px 8px #3b3333"          
        }}
        >
          Fractional NFT Lending
        </Typography>
      </Box>
      <Box className="container">
        {new Array(250).fill(0).map((item, idx) => {
          return <div key={idx}></div>;
        })}
      </Box>
    </Box>
  );
}
