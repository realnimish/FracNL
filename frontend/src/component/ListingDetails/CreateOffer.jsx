import {Box, Typography, Divider} from "@mui/material";
export default function CreateOffer(props) {
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
            />
            <Typography variant={"subtitle2"} sx={{marginTop: "13px", color: "#ff581e"}}>On Default you get minimum (10% of NFT) & 50 ETH (Security Deposit).</Typography>
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
              Interest Rate (% APY)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter interest rate"
            />
                        <Typography variant={"subtitle2"} sx={{marginTop: "13px", color: "#1b88c7"}}>You get paid 500 ETH in interest.</Typography>

          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
          >
            <Box sx={{ width: "100%", display: "flex" }}>
              <div
                className="btn btn-green"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "40px",
                }}
              >
                Withdraw & Edit 
              </div>
              <div
                className="btn btn-red"
                tabIndex={1}
                style={{ fontFamily: "'Ubuntu Condensed', sans-serif" }}
              >
                Withdraw
              </div>
            </Box>
          </Box>
          <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            padding: " 0 30px 40px 30px",
          }}
        >
          <Typography textAlign={"left"} variant="h6" sx={{ width: "100%", marginTop: "20px" }}>
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
              Fraction You got:
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
        </Box>
      </Box>
    );
}