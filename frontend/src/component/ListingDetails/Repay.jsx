import { Box, Divider, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { makeTransaction } from "../../commons";
import BN from "bn.js";
export default function Repay(props) {
  const [amount, setAmount] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  const repayLoan = async () => {
    if (!props.id && !amount) return;
    try {
      await makeTransaction(
        props.api,
        props.contracts,
        props.activeAccount,
        "nftLending",
        "repayLoan",
        props.signer,
        new BN(amount * 1000_000_000_000),
        [props.id],
        (val) => {
          enqueueSnackbar("Transaction Finalized", { variant: "success" });
          props.getLoanStats();
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

  return (
    <Box className="repay">
      <Typography
        className="title"
        sx={{
          fontFamily: "'Ubuntu Condensed', sans-serif",
          letterSpacing: "1.5px",
          margin: "0px 0px 30px 0px",
        }}
        variant="h5"
      >
        Close Loan
      </Typography>
      <Box className="repayContainer">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            padding: " 0 40px 40px 40px",
          }}
        >
          <Typography
            textAlign={"left"}
            variant="h6"
            sx={{ width: "100%", marginTop: "10px" }}
          >
            Details
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
              Total Interest Amount:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {"500 ETH"}
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
              Interest paid:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {"500 ETH"}
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
              Principal Amount paid:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {"500 ETH"}
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
              Fraction Release:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {"11%"}
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
              Security Deposit Release:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {"Not release"}
            </Typography>
          </Box>
        </Box>
        {props.loanStats.loanStatus === "ACTIVE" && (
          <>
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
                placeholder="Enter repayment amount"
                value={amount}
                onChange={(e) => handleAmountChange(e)}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "44px 0 30px 0",
              }}
            >
              <Box sx={{ width: "100%", display: "flex" }}>
                <div
                  className="btn btn-blue"
                  tabIndex={1}
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                  }}
                  onClick={() => repayLoan()}
                >
                  Repay
                </div>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
