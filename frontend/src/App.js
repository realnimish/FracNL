import './App.css';
import { Box, List } from "@mui/material";
import NavBar from './component/Navbar';
import { useState, useEffect } from 'react';
import { web3FromSource } from "@polkadot/extension-dapp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from './component/HomePage';
import Footer from './component/Footer';
import ListNFT from './component/ListNFT';
import ListingDetail from './component/ListingDetails/ListingDetail';
import MintNFT from './component/Mint/MintNFT';

function App() {

  const [contract, setContract] = useState(null);
  const [activeAccount, setActiveAccount] = useState(null);
  const [api, setApi] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const createSigner = async () => {
      activeAccount ?
        setSigner(
          await web3FromSource(activeAccount.meta.source).then(
            (res) => res.signer
          )
        ) : setSigner(null);
    };
    createSigner();
  }, [activeAccount]);

  return (
    <Box sx={{ width: "100%" }} className="app">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <NavBar
          activeAccount={activeAccount}
          setActiveAccount={(acc) => setActiveAccount(acc)}
        />
        <Routes >
          <Route
            exact
            path="/"
            element={
              <Homepage
                activeAccount={activeAccount}
                contract={contract}
                api={api}
                signer={signer} />
            }
          />
          <Route exact path="/mint" element={<MintNFT/>} />
          <Route exact path="/list" element={<ListNFT/>} />
          <Route exact path="/fractionalise" element={<></>} />
          <Route exact path="/profile" element={<></>} />
          <Route exact path="/listing" element={<ListingDetail/>} />
          <Route exact path="/error" element={<>Error</>}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
