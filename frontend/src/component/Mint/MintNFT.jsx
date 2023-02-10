import { Box, Typography } from "@mui/material";
import "../../App.css";
import { useState, useEffect } from "react";
import ImagePreview from "./ImagePreview";
import { Web3Storage } from "web3.storage";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MintNFT(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [CID, setCID] = useState("");
  const [open, setOpen] = useState(false);
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5MzJjM2FmOWE4QUI1NzlFOEI1NUZBNjNEYUVmZjQ4MDliM0I4NmUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzU3NjU4NjA1MDIsIm5hbWUiOiJoYWNrYXRob24ifQ.uwT-Wz-HsXrOK-Q_bpa07jbe_BF_Wbv5uP-sJU26Cp4",
  });
  //const { mutateAsync: upload } = useStorageUpload();
  const [file, setFile] = useState(null);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const uploadToIpfs = async () => {
    const rootCid = await client.put(file.files, {
      name: "nft image",
      maxRetries: 3,
    });
    setCID(rootCid);
    console.log("CID of uploaded file", rootCid);
    handleClick();
  };

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (file) {
      uploadToIpfs();
    }
  }, [file]);

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "#03080f",
        marginTop: "70px",
        paddingTop: "30px",
        minHeight: "500px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "70px" }}
      >
        <Typography
          className="title"
          sx={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            letterSpacing: "1.5px",
            margin: "0px 0px 0px 0px",
          }}
          variant="h5"
          textAlign={"center"}
        >
          Mint nft
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "#bcb520", marginBottom: "10px" }}
        >
          {" "}
          * Upload an Image from your device and Mint your NFT
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "300px",
          }}
        >
          <div
            className="btn btn-green"
            tabIndex={1}
            style={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
            }}
            onClick={(e) => {
              document.getElementById("UploadImage").click();
            }}
          >
            Upload Image
            <input
              accept="image/*"
              type="file"
              id="UploadImage"
              style={{ display: "none" }}
              onChange={(e) => {
                setSelectedImage(e.target.files[0]);
                setFile(document.querySelector('input[type="file"]'));
              }}
            />
          </div>
          <div
            className="btn btn-red"
            tabIndex={1}
            style={{
              fontFamily: "'Ubuntu Condensed', sans-serif",
            }}
          >
            Mint NFT
          </div>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          marginTop: "60px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {imageUrl && selectedImage && <ImagePreview image={imageUrl} />}
      </Box>
      {CID !== "" && (
        <Box
          component="div"
          sx={{
            margin: "50px 0",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ width: "400px", color: "gray" }}
            textAlign={"center"}
          >
            {"Image uploaded to IPFS with CID: "}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>{CID}</Typography>
        </Box>
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Image succesfully uploaded to IPFS!
        </Alert>
      </Snackbar>
    </Box>
  );
}
