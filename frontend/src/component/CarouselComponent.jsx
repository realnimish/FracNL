import Card from "./CardComponent";
import { Box, Typography } from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import "../index.css";

export default function CarouselComponent(props) {
  const scroll = (el, val) => {
    el = document.getElementsByClassName("carouselWrapper");
    let targetEl;
    for (var i = 0; i < el.length; i++) {
      console.log(
        el[i].getElementsByClassName("carouselHeaderWrapper")[0].innerText
      );
      if (
        el[i].getElementsByClassName("carouselHeaderWrapper")[0].innerText ===
        props.title
      ) {
        targetEl = el[i];
        break;
      }
    }
    targetEl = targetEl.getElementsByClassName("carouselBodyContainer")[0];
    targetEl.scroll({ left: targetEl.scrollLeft + val, behavior: "smooth" });
  };
  return (
    <Box
      component="div"
      className="carouselWrapper"
      sx={{
        margin: "30px auto",
        minWidth: "350px",
        width: "80%",
        marginBottom: "100px",
      }}
    >
      <Box
        component="div"
        className="carouselHeaderWrapper"
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box component="div" className="header">
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
              letterSpacing: "1.5px",
            }}
            className={"carouselTitle"}
          >
            {props.title}
          </Typography>
        </Box>
        <Box
          component="div"
          className="buttonWrapper"
          sx={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <ArrowCircleLeftOutlinedIcon
            sx={{ marginRight: "16px", fontSize: "30px", cursor: "pointer" }}
            onClick={() => scroll(props.title, -800)}
          />
          <ArrowCircleRightOutlinedIcon
            sx={{ fontSize: "30px", cursor: "pointer" }}
            onClick={() => scroll(this, 800)}
          />
        </Box>
      </Box>
      <Box
        component="div"
        className="carouselBodyContainer"
        sx={{
          minWidth: "350px",
          width: "100%",
          display: "flex",
          padding: "20px 0 30px 0 ",
          marginTop: "45px",
        }}
      >
        {props.items?.map((item, idx) => (
          <Box sx={{ margin: "0 40px" }} key={idx}>
            {props.isLoan && (
              <Card
                creatorAddress={item.createAddress}
                image={item.image}
                askValue={item.askValue}
                duration={item.duration}
                fraction={item.fraction}
                status={"CANCELLED"}
                key={idx}
                link={"/listing/" }
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
