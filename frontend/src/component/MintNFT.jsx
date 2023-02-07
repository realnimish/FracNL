import { Box, Typography } from "@mui/material";
import "../App.css";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import ImagePreview from "./ImagePreview";

export default function MintNFT(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  //const [file, setFile] = useState();
  //const { mutateAsync: upload } = useStorageUpload();

  // const uploadToIpfs = async () => {
  //   const uploadUrl = await upload({
  //     data: [file],
  //     options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
  //   });
  //   console.log(uploadUrl);
  // }

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

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
          onClick={(e) => {document.getElementById("UploadImage").click()}}
        >
          Upload Image
          <input
            accept="image/*"
            type="file"
            id="UploadImage"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files[0])}
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
