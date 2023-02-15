import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { cutAddress } from "../../commons";
import Identicon from "@polkadot/react-identicon";

export default function Offers(props) {
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
  };

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
      {props.offers.map((offer) => {
        return (
          <>
            <Box className="offer" sx={{ marginBottom: "30px" }}>
              <Identicon
                size={40}
                theme={"polkadot"}
                value={offer.lenderAddress}
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
                    {cutAddress(offer.lenderAddress, 15, 15)}
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
                    {offer.amount}
                  </Typography>
                  <Typography variant="h6" sx={{ width: "50%" }}>
                    {offer.interest}
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
                {true ? (
                  true ? (
                    <Box sx={{display: "flex",flexDirection: "column"}}>
                      <Typography variant="subtitle2" sx={{color: "gray"}}>Earned :</Typography>
                      <Typography variant="h6" className="returns" sx={{fontFamily: "'Courgette', cursive"}}>24.4 ETH</Typography>
                      </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ color: Status.rejected.color }}
                    >
                      {Status.rejected.text}
                    </Typography>
                  )
                ) : (
                  <>
                    <Box className="offerAcceptBtn" tabIndex={1}>
                      <DoneIcon className="greenColor" />
                    </Box>
                    <Box className="offerRejectBtn" tabIndex={1}>
                      <CloseIcon className="redColor" />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </>
        );
      })}
    </Box>
  );
}
