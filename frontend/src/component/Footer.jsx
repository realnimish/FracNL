import { Box, Typography } from "@mui/material";
import "../App.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import Logo from "./Logo.jsx";

export default function Footer(props) {
  return (
    <Box
      component="div"
      sx={{
        marginTop: "50px",
        backgroundColor: "#03080f",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <a href="https://github.com/realnimish/FracNL">
          <TwitterIcon
            id="twitterIcon"
            sx={{
              marginRight: "20px",
              fontSize: "30px",
              cursor: "pointer",
              color: "grey",
            }}
          />
        </a>

        <a href="https://github.com/SayanKar/gencom-nft">
          <GitHubIcon
            id="githubIcon"
            sx={{
              marginRight: "20px",
              fontSize: "30px",
              cursor: "pointer",
              color: "grey",
            }}
          />
        </a>

        <a href="https://github.com/SayanKar/gencom-nft">
          <InstagramIcon
            id="instagramIcon"
            sx={{
              marginRight: "20px",
              fontSize: "30px",
              cursor: "pointer",
              color: "grey",
            }}
          />
        </a>
      </Box>
      <Box
        component="div"
        sx={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "400",
            fontFamily: "'Fredoka One', cursive",
          }}
        >
          Gencom is a platform for creating art together as a community,
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >      
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Fredoka One', cursive",
            fontWeight: "400",
          }}
        >
          owning art together as a community.
        </Typography>
      </Box>
      <Box
       component="div"
       sx={{
        marginBottom: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       }}
      >
        <Logo />
      </Box>
    </Box>
  );
}
