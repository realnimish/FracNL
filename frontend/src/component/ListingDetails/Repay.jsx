import { Box, Divider, Typography } from "@mui/material";
export default function Repay(props) {
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
          <Typography textAlign={"left"} variant="h6" sx={{ width: "100%", marginTop: "10px" }}>
            Details
          </Typography>
          <Divider sx={{background: "#3b3a3a", width: "100%", marginTop: "7px"}} orientation="horizontal" light={true}/>
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
            >
              Repay
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
