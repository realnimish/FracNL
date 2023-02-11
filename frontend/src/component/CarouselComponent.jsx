import Card from "./CardComponent";
import { Box, Typography } from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";

export default function CarouselComponent(props) {
  return (
    <Box component="div" className="carouselWrapper">
      <Box
        component="div"
        className="carouselHeaderWrapper"
        sx={{
          display: "flex",
        }}
      >
        <Box component="div" className="header">
          <Typography
            variant="h5"
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
        <Box component="div" className="buttonWrapper" sx={{ display: "flex", paddingTop: "5px" }}>
          <ArrowCircleLeftOutlinedIcon sx={{ marginRight: "8px" }}/>
          <ArrowCircleRightOutlinedIcon />
        </Box>
      </Box>
      <Box
       component="div"
       className="carouselBodyContainer">

      </Box>
    </Box>
  );
}
