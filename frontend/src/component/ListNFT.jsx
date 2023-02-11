import { Box, Typography } from "@mui/material";
export default function ListNFT(props) {
  return (
    <Box sx={{ margin: "90px 0", display: "flex", justifyContent: "center", height: "fit-content", marginBottom: "200px"}}>
      <Box
        sx={{
          margin: "90x 0",
          minWidth: "300px",
          width: "70%",
          maxWidth: "700px",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
          }}
          variant="h5"
          textAlign={"center"}
        >
          Create a listing
        </Typography>
        <Box sx={{ width: "100%", marginTop: "60px" }}>
          <Box
            className="selectContainer"
            sx={{
              width: "100%",
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              className="selectLabel"
              style={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            >
              {"Select token Id : "}
            </label>
            <select className="select" style={{ marginBottom: "20px" }}>
              <option value="1">Token Id : 1</option>
              <option value="2">Token Id: 2</option>
              <option value="7">Token Id: 7</option>
              <option value="8">
                {"Token Id: 8 (Fractionalised)(Ownership 30%)"}
              </option>
            </select>
          </Box>
          <Box sx={{ marginTop: "50px" }}>
            <Typography
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
              }}
              textAlign={"center"}
              variant="h6"
            >
              Fractionalise NFT
            </Typography>
            <Box
              sx={{
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "20px",
                  color: "#d1b473",
                }}
                variant={"subtitle1"}
              >
                Give contract access to fractionalise your NFT
              </Typography>
              <div
                className="btn btn-red"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
              >
                Approve
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "20px",
                  color: "#d1b473",
                }}
                variant={"subtitle1"}
              >
                Fractionalise your selected NFT
              </Typography>
              <div
                className="btn btn-done"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
              >
                Fractionalise
              </div>
            </Box>
          </Box>
          <Box sx={{ marginTop: "50px" }}>
            <Typography
              sx={{
                fontFamily: "'Ubuntu Condensed', sans-serif",
                color: "gray",
                marginBottom: "30px"
              }}
              textAlign={"center"}
              variant="h6"
            >
              Fill details
            </Typography>
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap"}}>
              <Box
                className="inputContainer"
                sx={{ width: "45%", marginTop: "15px", marginRight: "10%" }}
              >
                <label
                  className="inputLabel"
                  style={{
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    color: "gray",
                  }}
                >
                  {"Ask Amount (AZERO)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter ask amount"
                />
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
                  {"Duration (in days)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter ask amount"
                />
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
                  {"Fraction to put as collateral(%)"}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter fraction"
                />
              </Box>
              <Box sx={{width: "100%"}}>
              <Box
              sx={{
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                  marginRight: "20px",
                  color: "#d1b473",
                }}
                variant={"subtitle1"}
              >
                Give contract access to operate on your fractionalised NFT
              </Typography>
              <div
                className="btn btn-red"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
              >
                Approve
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="btn btn-green"
                tabIndex={1}
                style={{
                  fontFamily: "'Ubuntu Condensed', sans-serif",
                }}
              >
                Create
              </div>
            </Box>
            </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
