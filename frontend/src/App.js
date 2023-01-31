import './App.css';
import { Box } from "@mui/material";
import NavBar from './component/Navbar';
import { useState, useEffect } from 'react';
import { web3FromSource } from "@polkadot/extension-dapp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './component/Footer';

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
          <Route exact path="/" element={<>Home</>} />
          <Route exact path="/mint" element={<>Mint</>} />
          <Route exact path="/list" element={<></>} />
          <Route exact path="/fractionalise" element={<></>} />
          <Route exact path="/profile" element={<></>} />
          <Route exact path="/ad" element={<></>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
