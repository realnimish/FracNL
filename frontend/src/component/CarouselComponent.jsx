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
  const [fracTokens, setFracTokens] = useState([]);
  const [ercTokens, setErcTokens] = useState([]);
  const [tokensList, setTokensList] = useState([]);

  const getUserTokens = async () => {
    try {
      // Get from ERC721
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getUserTokens",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens erc : ", val);
          setErcTokens(val.Ok);
        }
      ).catch((err) => {
        console.log("getUserTokens erc", err);
      });
      // Get from fractionalised
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "fractionalizer",
        "getUserHoldings",
        0,
        [props.activeAccount?.address],
        (val) => {
          console.log("getUserTokens frac : ", val);
          setFracTokens(val.Ok);
        },
        (val) => {
          console.log("Error on getUserTokens frac", val);
        }
      ).catch((err) => {
        console.log("getUserTokens frac", err);
      });
    } catch (err) {
      console.log("getUserTokens", err);
    }
  };

  useEffect(() => {
    let erc = ercTokens.map((token) => {
      return {
        tokenId: token,
        fractionalized: false,
        ownership: "100%",
      };
    });

    let frac = fracTokens.map((token) => {
      return {
        tokenId: token[0],
        fractionalized: true,
        ownership:
          (token[1].replace(/,/g, "") * 100) / token[2].replace(/,/g, "") + "%",
      };
    });

    console.log("List ", erc, frac);
    setTokensList([...erc, ...frac]);
  }, [ercTokens, fracTokens]);

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
    props.isNFT && getUserTokens();
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
        {((props.isLoan && loans.length === 0) ||
          (props.isNFT && tokensList.length === 0)) && (
          <Box
            sx={{
              marginTop: "50px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                height: "100px",
                width: "300px",
                color: "white",
                background: "#0d0d0d",
                boxShadow: "0px 0px 5px #232323",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              variant={"h6"}
              textAlign={"center"}
            >
              No items to show
            </Typography>{" "}
          </Box>
        )}
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
        {tokensList?.map((item, idx) => {
          return (
            props.isNFT && (
              <RenderNFTItem
                item={item}
                activeAccount={props.activeAccount}
                contracts={props.contracts}
                api={props.api}
                signer={props.signer}
                key={idx}
              />
            )
          );
        })}
      </Box>
    </Box>
  );
}

const RenderNFTItem = (props) => {
  const [imageUrl, setImageUrl] = useState("");
  const getTokenURI = async () => {
    if (!props?.item?.tokenId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "erc721",
        "getTokenUri",
        0,
        [props.item.tokenId],
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
  useEffect(() => {
    getTokenURI();
  }, [props.item.tokenId]);

  console.log("image URL", imageUrl);

  return (
    <Box sx={{ margin: "0 40px" }}>
      <Box
        sx={{
          height: "fit-content",
          width: "300px",
          padding: "20px",
          cursor: "pointer",
          borderRadius: "50px",
        }}
        tabIndex={1}
        className="card"
      >
        <Box
          sx={{
            height: "calc(100% - 40px)",
            width: "300px",
            borderRadius: "50px",
            position: "absolute",
            top: "0",
            right: "0",
            padding: "20px",
          }}
          className="cardClone"
        ></Box>
        <img
          src={"https://ipfs.io/ipfs/" + imageUrl}
          style={{ width: "100%", borderRadius: "30px", marginBottom: "15px" }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body1" sx={{ marginTop: "5px", color: "gray", marginRight: "5px"}}>
            Token Id:{" "}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: "5px" }}>
            {props.item.tokenId}{" "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body1" sx={{ marginTop: "5px", color: "gray", marginRight: "5px"}}>
            Fractionalised: 
          </Typography>
          <Typography variant="body1" sx={{ marginTop: "5px" }}>

            {!props.item.fractionalized ? "NO": props.item.ownership}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

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
  }, [listingDetails.tokenId]);

  return (
    <Box sx={{ margin: "0 40px" }}>
      <Card
        creatorAddress={listingDetails.creatorAddress}
        image={"https://ipfs.io/ipfs/" + imageUrl}
        askValue={listingDetails.askAmount + "TZERO"}
        duration={listingDetails.duration + "Day(s)"}
        fraction={listingDetails.holding / 1000_000 + "%"}
        status={status}
        link={"/listing/" + props.loanId}
      />
    </Box>
  );
};
