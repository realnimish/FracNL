import { Box, Typography, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { makeQuery, makeTransaction } from "../../commons";
import BN from "bn.js";
export default function CreateOffer(props) {
  const [amount, setAmount] = useState(null);
  const [interest, setInterest] = useState(null);
  const [offerId, setOfferId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [offerDetails, setOfferDetails] = useState({
    amount: "0",
    interest: "0",
    status: "",
  });
  const [settlement, setSettlement] = useState({
    returned: "0",
    nftHolding: "0",
  });
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleInterestChange = (e) => {
    setInterest(e.target.value);
  };

  const makeOffer = async () => {
    if (!props.id) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "makeOffer",
        props.signer,
        new BN(parseInt(amount * 1000_000) * 1000_000),
        [props.id, new BN(parseInt(amount * interest) * 1000_000_000_0)],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          getActiveOfferId();
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

  const withdrawOffer = async () => {
    if (!props.id) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "withdrawOffer",
        props.signer,
        0,
        [props.id],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          setOfferDetails({
            amount: "0",
            interest: "0",
            status: "",
          });
          setSettlement({ returned: "0", nftHolding: "0" });
          setOfferId(null);
          setAmount(null);
          setInterest(null);
          getActiveOfferId();
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

  const getOfferDetails = async () => {
    if (!props.id && !offerId) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getOfferDetails",
        0,
        [props.id, offerId],
        (val) => {
          console.log("Offer details : ", val);
          let data = val.Ok.Ok;
          setOfferDetails({
            amount: data.amount.replace(/,/g, ""),
            interest: data.interest.replace(/,/g, ""),
            status: data.status,
          });
        }
      ).catch((err) => {
        console.log("Offer details : ", err);
      });
    } catch (err) {
      console.log("Offer details : ", err);
    }
  };

  const getActiveOfferId = async () => {
    if (!props.id && !props.activeAccount) return;
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getActiveOfferId",
        0,
        [props.id, props.activeAccount.address],
        (val) => {
          console.log("Offer Id : ", val);
          if (!val.Ok.Err) {
            setOfferId(val.Ok);
          }
        }
      ).catch((err) => {
        console.log("Offer Id : ", err);
      });
    } catch (err) {
      console.log("Offer Id : ", err);
    }
  };

  const getLendersSettlement = async () => {
    if (!props.id && !offerId) return;
    console.log(props.id, offerId);
    try {
      await makeQuery(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "getLendersSettlement",
        0,
        [props.id, offerId],
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
    getActiveOfferId();
  }, [props.id, props.activeAccount]);

  useEffect(() => {
    getLendersSettlement();
    getOfferDetails();
  }, [offerId]);

  useEffect(() => {
    if (offerDetails.amount !== "0" && offerDetails.interest !== "0") {
      setAmount(parseInt(offerDetails.amount / 1000_000) / 1000_000);
      setInterest(
        (parseFloat(offerDetails.interest / 1000_000) /
          parseFloat(offerDetails.amount / 1000_000)) *
          100
      );
    }
  }, [offerDetails]);

  return (
    <Box className="createOffer">
      <Typography
        className="title"
        sx={{
          fontFamily: "'Ubuntu Condensed', sans-serif",
          letterSpacing: "1.5px",
          margin: "0px 0px 30px 0px",
        }}
        variant="h5"
      >
        Your Offer
      </Typography>
      <Box className="createOfferContainer">
        <Box
          className="inputContainer"
          sx={{ width: "45%", marginTop: "15px" }}
        >
          <label
            className="inputLabel"
            style={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
              color: "gray",
            }}
          >
            {"Amount (TZERO)"}
          </label>
          <input
            type="text"
            className="input"
            placeholder="Enter lending amount"
            value={amount}
            onChange={(e) => handleAmountChange(e)}
          />
          <Typography
            variant={"subtitle2"}
            sx={{ marginTop: "13px", color: "#ff581e" }}
          >
            {amount &&
              props.listingDetails.askAmount &&
              "On Default you get minimum (" +
                (amount / props.listingDetails.askAmount) *
                  ((props.listingDetails.holding / 100_000_000) * 100) +
                "% of NFT) & " +
                parseFloat(
                  (amount / props.listingDetails.askAmount) *
                    props.listingDetails.securityDeposit
                ).toPrecision(6) +
                " TZERO (Security Deposit)."}
          </Typography>
        </Box>
        <Box
          className="inputContainer"
          sx={{ width: "45%", marginTop: "15px" }}
        >
          <label
            className="inputLabel"
            style={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
              color: "gray",
            }}
          >
            Interest Rate (%)
          </label>
          <input
            type="text"
            className="input"
            placeholder="Enter interest rate"
            value={interest}
            onChange={(e) => handleInterestChange(e)}
          />
          <Typography
            variant={"subtitle2"}
            sx={{ marginTop: "13px", color: "#1b88c7" }}
          >
            {interest &&
              amount &&
              "You get paid " +
                (amount * interest) / 100 +
                " TZERO in interest."}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
        >
          <Box sx={{ width: "100%", display: "flex" }}>
            {props.loanStats?.loanStatus == "OPEN" && !offerId && (
              <div
                className="btn btn-green"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "40px",
                }}
                onClick={() => makeOffer()}
              >
                Create
              </div>
            )}{" "}
            {props.loanStats?.loanStatus == "OPEN" && offerId && (
              <div
                className="btn btn-red"
                tabIndex={1}
                style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
                onClick={() => withdrawOffer()}
              >
                Withdraw
              </div>
            )}
          </Box>
        </Box>
        {offerId && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              padding: " 0 30px 40px 30px",
            }}
          >
            <Typography
              textAlign={"left"}
              variant="h6"
              sx={{ width: "100%", marginTop: "20px" }}
            >
              {"Details (" + offerDetails.status + ")"}
            </Typography>
            <Divider
              sx={{ background: "#3b3a3a", width: "100%", marginTop: "7px" }}
              orientation="horizontal"
              light={true}
            />
            <Box
              sx={{ width: "200px", height: "fit-content" }}
              className="detailItem"
            >
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", color: "gray" }}
              >
                Total Interest:
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "5px" }}>
                {parseInt(offerDetails.interest / 1000_000) / 1000_000 +
                  " TZERO"}
              </Typography>
            </Box>
            <Box
              sx={{ width: "200px", height: "fit-content" }}
              className="detailItem"
            >
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", color: "gray" }}
              >
                Principle Amount:
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "5px" }}>
                {parseInt(offerDetails.amount / 1000_000) / 1000_000 + " TZERO"}
              </Typography>
            </Box>
            <Box
              sx={{ width: "200px", height: "fit-content" }}
              className="detailItem"
            >
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", color: "gray" }}
              >
                {"Expected Amount(current):"}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "5px" }}>
                {parseInt(settlement.returned / 1000_000) / 1000_000 + " TZERO"}
              </Typography>
            </Box>
            <Box
              sx={{ width: "200px", height: "fit-content" }}
              className="detailItem"
            >
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", color: "gray" }}
              >
                {"Fraction (current):"}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "5px" }}>
                {settlement.nftHolding + "%"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
