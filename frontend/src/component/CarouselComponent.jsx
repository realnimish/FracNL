import Card from "./CardComponent";
import { Box, Typography } from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import "../index.css";
import { makeQuery } from "../commons";
import { useEffect, useState } from "react";

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
  const [loans, setLoans] = useState([]);
  const getUserLoans = async () => {
    if (!props.address) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getUserLoans",
        0,
        [props.address],
        (val) => {
          console.log("getUserLoans : ", val.Ok);
          setLoans(val.Ok);
        }
      ).catch((err) => {
        console.log("getUserLoans : ", err);
      });
    } catch (err) {
      console.log("getUserLoans : ", err);
    }
  };

  useEffect(() => {
    props.isLoan && getUserLoans();
  }, [props.address]);

  console.log("loans", loans);

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
        {loans?.map((item, idx) => {
          return (
            props.isLoan && (
              <RenderLoanItem
                activeAccount={props.activeAccount}
                contracts={props.contracts}
                api={props.api}
                signer={props.signer}
                loanId={item}
                key={idx}
              />
            )
          );
        })}
      </Box>
    </Box>
  );
}

const RenderLoanItem = (props) => {
  console.log("RenderLoanItem");
  const [listingDetails, setListingDetails] = useState({
    creatorAddress: "",
    askAmount: "0",
    holding: "0",
    duration: "0",
    securityDeposit: "0",
    listingDate: new Date(),
    tokenId: "0",
  });
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loanStats, setLoanStats] = useState({
    startTimestamp: null,
    raised: "0",
    limitLeft: "0",
    interest: "0",
    repaid: "0",
    loanStatus: "OPEN",
  });

  const getLoanMetadata = async () => {
    if (!props.loanId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanMetadata",
        0,
        [props.loanId],
        (val) => {
          console.log("getLoanMetadata : ", val);
          let data = val.Ok.Ok;
          setListingDetails({
            creatorAddress: data.borrower,
            askAmount:
              parseInt(data.amountAsked.replace(/,/g, "") / 1000_000) /
              1000_000,
            holding: parseInt(data.sharesLocked.replace(/,/g, "") / 1000_000),
            securityDeposit:
              parseInt(data.securityDeposit.replace(/,/g, "") / 1000_000) /
              1000_000,
            listingDate: new Date(
              parseInt(data.listingTimestamp.replace(/,/g, ""))
            ),
            duration: data.loanPeriod.replace(/,/g, "") / 86400 / 1000,
            tokenId: data.tokenId,
          });
        }
      ).catch((err) => {
        console.log("getLoanMetadata", err);
      });
    } catch (err) {
      console.log("getLoanMetadata", err);
    }
  };

  const getLoanStats = async () => {
    if (!props.loanId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLoanStats",
        0,
        [props.loanId],
        (val) => {
          console.log("getLoanStats : ", val);
          let data = val.Ok.Ok;
          setLoanStats({
            startTimestamp: data.startTimestamp
              ? parseInt(data.startTimestamp?.replace(/,/g, ""))
              : null,
            loanStatus: data.loanStatus,
            raised:
              parseInt(data.raised.replace(/,/g, "") / 1000_000) / 1000_000,
            repaid:
              parseInt(data.repaid.replace(/,/g, "") / 1000_000) / 1000_000,
            interest:
              parseInt(data.interest.replace(/,/g, "") / 1000_000) / 1000_000,
          });
        }
      ).catch((err) => {
        console.log("getLoanStats", err);
      });
    } catch (err) {
      console.log("getLoanStats", err);
    }
  };

  const getTokenURI = async () => {
    if (!listingDetails.tokenId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getTokenUri",
        0,
        [listingDetails.tokenId],
        (val) => {
          console.log("getTokenURI : ", val);
          setImageUrl(val.Ok);
        }
      ).catch((err) => {
        console.log("getTokenURI", err);
      });
    } catch (err) {
      console.log("getTokenURI", err);
    }
  };

  const getStatus = () => {
    if (loanStats.loanStatus) {
      if (loanStats.loanStatus == "CANCELLED") {
        setStatus("CANCELLED");
      } else if (loanStats.loanStatus == "CLOSED") {
        setStatus("CLOSED");
      } else if (loanStats.loanStatus == "ACTIVE") {
        setStatus("ACTIVE");
      } else {
        setStatus("OPEN");
      }
    }
  };

  useEffect(() => {
    getLoanMetadata();
    getLoanStats();
    getStatus();
  }, [props.loanId]);

  useEffect(() => {
    getTokenURI();
  },[listingDetails.tokenId]);

  return (
    <Box sx={{ margin: "0 40px" }}>
      <Card
        creatorAddress={listingDetails.creatorAddress}
        image={"https://ipfs.io/ipfs/" + imageUrl}
        askValue={listingDetails.askAmount + "TZERO"}
        duration={listingDetails.duration + "Day(s)"}
        fraction={listingDetails.holding/1000_000 + "%"}
        status={status}
        link={"/listing/"+props.loanId}
      />
    </Box>
  );
};
