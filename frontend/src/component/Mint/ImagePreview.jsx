import { Box } from "@mui/material";
export default function ImagePreview(props) {

  return (
    <Box
      sx={{
        height: "fit-content",
        width: "400px",
        padding: "20px",
        cursor: "pointer",
        borderRadius: "50px",
      }}
      tabIndex={1}
      className="card"
    >
      <Box
        sx={{
          height: "calc(100% - 40px)",
          width: "400px",
          borderRadius: "50px",
          position: "absolute",
          top: "0",
          right: "0",
          padding: "20px",
        }}
        className="cardClone"
      ></Box>
      <img
        src={props.image}
        style={{ width: "100%", borderRadius: "30px", marginBottom: "15px" }}
      />
    </Box>
  );
}
