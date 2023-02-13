import './App.css';
import { Box, List } from "@mui/material";
import NavBar from './component/Navbar';
import { useState, useEffect } from 'react';
import { web3FromSource } from "@polkadot/extension-dapp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ContractPromise } from "@polkadot/api-contract";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Homepage from './component/HomePage';
import Footer from './component/Footer';
import ListNFT from './component/ListNFT';
import ListingDetail from './component/ListingDetails/ListingDetail';
import MintNFT from './component/Mint/MintNFT';
import Fractionalise from './component/Fractionalise';
import Profile from './component/Profile';
import { ABI_ERC721, ABI_FRACTIONALIZER, ABI_NFT_LENDING, ERC721_ADDRESS, NFT_LENDING_ADDRESS, FRACTIONALIZER_ADDRESS, NETWORK_ENDPOINT } from './commons';
function App() {

  const [contracts, setContracts] =
    useState({
      erc721: null,
      fractionalizer: null,
      nftLending: null,
    });
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

  const connectToContract = async () => {
    const wsProvider = new WsProvider(NETWORK_ENDPOINT);
    const api = await ApiPromise.create({ provider: wsProvider });
    const erc721Contract = new ContractPromise(api, ABI_ERC721, ERC721_ADDRESS);
    const fractionaliserContract = new ContractPromise(api, ABI_FRACTIONALIZER, FRACTIONALIZER_ADDRESS);
    const nftLendingContract = new ContractPromise(api, ABI_NFT_LENDING, NFT_LENDING_ADDRESS);
    setApi(api);
    setContracts({
      erc721: erc721Contract,
      fractionalizer: fractionaliserContract,
      nftLending: nftLendingContract
    });
  };

  useEffect(() => {
    connectToContract();
  }, []);

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
                contracts={contracts}
                api={api}
                signer={signer} />
            }
          />
          <Route
            exact
            path="/mint"
            element={
              <MintNFT
                activeAccount={activeAccount}
                contracts={contracts}
                api={api}
                signer={signer} />
            }
          />
          <Route
            exact
            path="/list"
            element={
              <ListNFT
                activeAccount={activeAccount}
                contracts={contracts}
                api={api}
                signer={signer}
              />
            }
          />
          <Route exact path="/fractionalise" element={<Fractionalise />} />
          <Route exact path="/profile/:address" element={<Profile />} />
          <Route exact path="/listing/:id" element={<ListingDetail />} />
          <Route exact path="/error" element={<>Error</>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
