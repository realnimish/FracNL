import Card from "./CardComponent";
import { Box, Typography } from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import CarouselItem from "./CarouselItem";

export default function CarouselComponent(props) {
  return (
    <Box component="div" className="carouselWrapper">
      <Box
        component="div"
        className="carouselHeaderWrapper"
        sx={{
          display: "flex",
          marginBottom: "20px",
          marginLeft: "4%"
        }}
      >
        <Box component="div" className="header">
          <Typography
            variant="h4"
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
        <Box component="div" className="buttonWrapper" sx={{ display: "flex", paddingTop: "15px", marginLeft: "79%" }}>
          <ArrowCircleLeftOutlinedIcon sx={{ marginRight: "8px", }}/>
          <ArrowCircleRightOutlinedIcon />
        </Box>
      </Box>
      <Box
       component="div"
       className="carouselBodyContainer"
       sx={{
        minWidth: "350px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#212224",
        padding: "30px",
        marginLeft: "3%",
        marginRight: "3%",
        borderRadius: "30px"
       }}>
        <CarouselItem />
      </Box>
    </Box>
  );
}
