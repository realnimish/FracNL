import { Box, Typography } from "@mui/material";
import "../App.css";
import { useState, useEffect } from "react";
import ImagePreview from "./ImagePreview";
import { Web3Storage } from "web3.storage";

export default function MintNFT(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5MzJjM2FmOWE4QUI1NzlFOEI1NUZBNjNEYUVmZjQ4MDliM0I4NmUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzU3NjU4NjA1MDIsIm5hbWUiOiJoYWNrYXRob24ifQ.uwT-Wz-HsXrOK-Q_bpa07jbe_BF_Wbv5uP-sJU26Cp4",
  });
  //const { mutateAsync: upload } = useStorageUpload();
  const [file, setFile] = useState(null);

  const uploadToIpfs = async () => {
    const rootCid = await client.put(file.files, {
      name: "nft image",
      maxRetries: 3,
    });

    console.log(rootCid);
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
      <Box
        component="div"
        sx={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
}
