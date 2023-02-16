import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { cutAddress, makeQuery, makeTransaction } from "../../commons";
import Identicon from "@polkadot/react-identicon";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
export default function Offers(props) {
  const { enqueueSnackbar } = useSnackbar();
  const Status = {
    pending: {
      color: "gray",
      text: "PENDING",
    },
    accepted: {
      color: "#69c46d",
      text: "ACCEPTED",
    },
    rejected: {
      color: "#f47068",
      text: "REJECTED",
    },
    withdrawn: {
      color: "#6bb6ff",
      text: "WITHDRAWN",
    },
  };

  const [offers, setOffers] = useState([]);

  const getAllOffers = async () => {
    if (!props.id) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getAllOffers",
        0,
        [props.id],
        (val) => {
          console.log("getAllOffers : ", val);
          let data = val.Ok;
          data = data.map((item, idx) => {
            return {
              offerId: item[0],
              lenderAddress: item[1].lender,
              amount: item[1].amount.replace(/,/g, ""),
              interest: item[1].interest.replace(/,/g, ""),
              status: Status[item[1].status.toLowerCase()],
            };
          });
          setOffers([...data]);
        }
      ).catch((err) => {
        console.log("getAllOffers", err);
      });
    } catch (err) {
      console.log("getAllOffers", err);
    }
  };

  const respondToOffer = async (loanId, offerId, response) => {
    if (!loanId || !offerId) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "respondToOffer",
        props.signer,
        0,
        [loanId, offerId, response],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          getAllOffers();
        },
        () => {
          enqueueSnackbar("Transaction Submitted", {
            variant: "info",
          });
        }
      ).catch((err) => {
        enqueueSnackbar("" + err, { variant: "error" });
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    }
  };

  useEffect(() => {
    getAllOffers();
    const interval = setInterval(() => getAllOffers(), 20000);
    return () => clearInterval(interval);
  }, [props.id, props.activeAccount]);
  console.log(props.loanStats);

  return (
    <Box className="offers">
      <Typography
        className="title"
        sx={{
          fontFamily: "'Ubuntu Condensed', sans-serif",
          letterSpacing: "1.5px",
          margin: "0px 0px 30px 0px",
        }}
        variant="h5"
      >
        Offers
      </Typography>
      {offers.length === 0 && (
        <Box
          sx={{
            marginTop: "100px",
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
            No offers yet
          </Typography>{" "}
        </Box>
      )}
      {offers.map((offer, idx) => (
        <OfferRow
          key={idx}
          offer={offer}
          listingDetails={props.listingDetails}
          loanStats={props.loanStats}
          activeAccount={props.activeAccount}
          contracts={props.contracts}
          api={props.api}
          signer={props.signer}
          id={props.id}
          respondToOffer={(a, b, c) => respondToOffer(a, b, c)}
        />
      ))}
    </Box>
  );
}

const OfferRow = (props) => {
  const [settlement, setSettlement] = useState({
    returned: "0",
    nftHolding: "0",
  });
  const getLendersSettlement = async () => {
    if (!props.id && !props.offer.offerId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLendersSettlement",
        0,
        [props.id, props.offer.offerId],
        (val) => {
          console.log("Offer Settlement : ", val);
          let data = val.Ok.Ok;
          setSettlement({
            returned: parseInt(data[0].replace(/,/g, "")),
            nftHolding: data[1].replace(/,/g, "") / 1000_000_000_000,
          });
        }
      ).catch((err) => {
        console.log("Offer settlement : ", err);
      });
    } catch (err) {
      console.log("Offer settlement : ", err);
    }
  };

  useEffect(() => {
    getLendersSettlement();
  }, [props.id, props.offer.offerId]);

  return (
    <>
      <Box className="offer" sx={{ marginBottom: "30px" }}>
        <Identicon
          size={40}
          theme={"polkadot"}
          value={props.offer.lenderAddress}
          style={{ margin: "5px 0", marginRight: "40px" }}
        />
        <Box
          sx={{
            minWidth: "300px",
            width: "70%",
            display: "flex",
            flexDirection: "column",
            margin: "5px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ marginRight: "10px", color: "gray" }}
            >
              Lender Address :
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#b1b1b1" }}>
              {cutAddress(props.offer.lenderAddress, 15, 15)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ width: "50%", color: "gray" }}
            >
              {"Lend Amount : "}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ width: "50%", color: "gray" }}
            >
              {"Interest Rate : "}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ width: "50%" }}>
              {parseInt(props.offer.amount / 1000_000) / 1000_000 + " TZERO"}
            </Typography>
            <Typography variant="h6" sx={{ width: "50%" }}>
              {parseFloat(props.offer.interest / props.offer.amount) * 100 +
                "%"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            margin: "5px 0",
          }}
        >
          {["CLOSED", "CANCELLED"].includes(props.loanStats.loanStatus) &&
          props.offer.status.text === "ACCEPTED" ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" sx={{ color: "gray" }}>
                Earned :
              </Typography>
              <Typography
                variant="h6"
                className="returns"
                sx={{ fontFamily: "'Courgette', cursive" }}
              >
                {parseInt(settlement.returned / 1000_000_000) / 1000 +
                  " TZERO " +
                  (settlement.nftHolding !== 0
                    ? "  &  " + settlement.nftHolding + "%"
                    : "")}
              </Typography>
            </Box>
          ) : props.loanStats.loanStatus === "OPEN" &&
            props.offer.status.text === "PENDING" &&
            props.listingDetails.creatorAddress ===
              props.activeAccount.address ? (
            <>
              <Box
                className="offerAcceptBtn"
                tabIndex={1}
                onClick={() =>
                  props.respondToOffer(props.id, props.offer.offerId, true)
                }
              >
                <DoneIcon className="greenColor" />
              </Box>
              <Box
                className="offerRejectBtn"
                tabIndex={1}
                onClick={() =>
                  props.respondToOffer(props.id, props.offer.offerId, false)
                }
              >
                <CloseIcon className="redColor" />
              </Box>
            </>
          ) : (
            <Typography
              variant="body1"
              sx={{ color: props.offer.status.color }}
            >
              {props.offer.status.text}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};
