import Dialogue from "@mui/material/Dialog";
import React, { useState } from "react";
import { Box, Card, Button } from "@mui/material";
import WeenusABI from "../public/ABI/weenus.json";
import VarVaultABI from "../public/ABI/varvault.json";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import TextField from '@mui/material/TextField';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import WindowWithEthereum from 'web3modal';

type WithdrawModalProps = {
  open: boolean,
  onClose: () => void,
  vaultAddress: string
}

export const WithdrawModal = ({
  open,
  onClose,
  vaultAddress
}: WithdrawModalProps) => {

  const [number, setNumber] = useState(0);

  const withdraw = async () => {

    try {

      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractABI = VarVaultABI; // ABI array
      const contractAddress = vaultAddress; // Contract address
      const contract = new Contract(contractAddress, contractABI, signer);


      const transaction = await contract.withdraw(signer.getAddress(), BigNumber.from((number * 1e18).toString()));
      await transaction.wait(); // Wait for the transaction to be mined

    } catch (error) {
      console.error('Failed to interact with contract:', error);
    }

  }

  const handleChange = (event: any) => {
    const newValue = parseInt(event.target.value);
    if (!isNaN(newValue)) {
      setNumber(newValue);
    }
  };

  return (
    <Dialogue open={open} onClose={onClose} PaperProps={{ sx: { padding: '2.5rem', borderRadius: "24px" } }} >
      {/* <CloseButton onClose={onClose} /> */}

      <Box maxWidth="sm">
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Enter Amount"
          value={number}
          onChange={handleChange}
        />
      </Box>

      {/* Remove header and insert input token card */}
      {/* insert receipt token card */}

      <div style={{ display: "flex", justifyContent: "center", minWidth: 270, marginTop: 15 }}>
        <Button variant="contained"
          onClick={withdraw}
          sx={{
            background: 'linear-gradient(45deg, #e57816 30%, #f0ce34 90%)',
          }}>Withdraw</Button>
      </div>
    </Dialogue >
  );



}