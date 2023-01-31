import { Box, Typography } from "@mui/material";
import Card from "./CardComponent";
export default function Homepage(props) {
    return (
        <Box sx={{padding: "80px", minHeight: "100%", height: "fit-content"}}>
            <Typography variant="h6" sx={{fontFamily: "'Ubuntu Condensed', sans-serif", margin: "20px 0"}}>List</Typography>
            <Card />
        </Box>
    )
}