import * as React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import WindowWithEthereum from 'web3modal';
import LandingCard from '../src/LandingCard';
import DappBar from '../src/DappBar';
import Background from '../src/Background';


export default function dApp() {

  const connectToMetaMask = async () => {

    if (typeof window.ethereum !== 'undefined') {
      // MetaMask is available
      // Connect to MetaMask
      const provider = new Web3Provider(window.ethereum);

      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const address = signer._address;
      console.log('Connected to MetaMask:', address);


      try {
        // Prompt user to switch networks
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Target network chainId (in this example, Ethereum mainnet)
        });
        console.log('Network changed successfully');
      } catch (error) {
        // TODO: Popup saying MetaMask is not available
        console.error('Failed to switch networks:', error);
      }

    } else {
      // TODO: Popup saying MetaMask is not available
    }

  };


  return (
    <>
      <div style={{ zIndex: -1, position: "fixed" }}>
        <Background />
      </div>

      <DappBar />

      <Container maxWidth="lg">


        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

          {/* <Box maxWidth="sm">
            <Button variant="contained" component={Link} noLinkStyle href="/">
              Go to the home page
            </Button>
          </Box> */}

          <Box maxWidth="sm">
            <Button variant="contained" onClick={connectToMetaMask}>
              Connect to MetaMask
            </Button>
          </Box>


          <LandingCard />

          <Copyright />
        </Box>
      </Container>
    </>
  );
}
