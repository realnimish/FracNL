import { Box, Typography } from "@mui/material";
import "../App.css";
import { useState, useEffect } from "react";
import ImagePreview from "./ImagePreview";
import { Web3Storage } from 'web3.storage';

export default function MintNFT(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI5MzJjM2FmOWE4QUI1NzlFOEI1NUZBNjNEYUVmZjQ4MDliM0I4NmUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzU3NjU4NjA1MDIsIm5hbWUiOiJoYWNrYXRob24ifQ.uwT-Wz-HsXrOK-Q_bpa07jbe_BF_Wbv5uP-sJU26Cp4' })
  //const { mutateAsync: upload } = useStorageUpload();
  const [file, setFile] = useState(null);

   const uploadToIpfs = async () => {
    const rootCid = await client.put(file.files , {
      name: 'nft image',
      maxRetries: 3,
    });
  
     console.log(rootCid);
   }

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
      }}
    >
      <Box
        component="div"
        sx={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {imageUrl && selectedImage && <ImagePreview image={imageUrl} />}
      </Box>
      <Box
        component="div"
        sx={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="btn btn-green"
          tabIndex={1}
          style={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            marginRight: "30px",
          }}
          onClick={(e) => {document.getElementById("UploadImage").click();}}
        >
          Upload Image
          <input
            accept="image/*"
            type="file"
            id="UploadImage"
            style={{ display: "none" }}
            onChange={(e) => {setSelectedImage(e.target.files[0]); setFile(document.querySelector('input[type="file"]')); }}
          />
        </div>
      </Box>
      <Box
        component="div"
        sx={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="btn btn-red"
          tabIndex={1}
          style={{
            fontFamily: "'Ubuntu Condensed', sans-serif",
            marginRight: "30px",
          }}
        >
          Mint NFT
        </div>
      </Box>
    </Box>
  );
}
