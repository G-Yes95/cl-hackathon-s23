import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Paper,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { Web3Provider } from '@ethersproject/providers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { ethers } from 'ethers';
import WindowWithEthereum from 'web3modal';
import VarVaultFactoryABI from "../public/ABI/varvaultfactory.json";
import VarVaultABI from "../public/ABI/varvault.json";
import WeenusABI from "../public/ABI/weenus.json";
import OracleABI from "../public/ABI/oracleABI.json";
import { Contract } from "@ethersproject/contracts";
import formatAccounting from "../utils/formatAccounting";


export default function LandingCard() {

  const [selectedStablecoin, setSelectedStablecoin] = useState("");
  const [openModalDeposit, setOpenModalDeposit] = useState(false);
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stablecoins, setStablecoins] = useState<string[]>([]);
  const [vaults, setVaults] = useState({});
  const [events, setEvents] = useState<any[]>([]);

  const handleStablecoinChange = (event: any) => {
    setSelectedStablecoin(event.target.value);
  };

  useEffect(() => {

    const web3provider = new Web3Provider(window.ethereum);
    const tokenABI = WeenusABI; // ABI array

    const fetchData = async () => {
      let stables: string[] = [];
      let tempVaults: any = {};

      await Promise.all(events.map(async (item: any) => {

        const vaultAddress = item.args.newVarVault;
        const varVaultContract = new Contract(vaultAddress, VarVaultABI, web3provider);

        const vaultDecimals = parseInt(await varVaultContract.decimals());
        const vaultSupply = parseInt(await varVaultContract.totalSupply());

        const assetOracleAddress = await varVaultContract.assetOracle();
        const assetOracleContract = new Contract(assetOracleAddress, OracleABI, web3provider);
        const assetOracleDecimals = await assetOracleContract.decimals();
        const assetOraclePrice = await assetOracleContract.latestAnswer();
        const assetPriceFloat = assetOraclePrice / (10 ** assetOracleDecimals);

        const depositTokenContract = new Contract(item.args.depositToken, tokenABI, web3provider);
        const depositTokenSymbol = (await depositTokenContract.symbol());
        const depositTokenDecimals = (await depositTokenContract.decimals());
        const vaultDepositBalance = await depositTokenContract.balanceOf(vaultAddress);
        const vaultDepositBalanceFloat = vaultDepositBalance / (10 ** depositTokenDecimals);

        const assetTokenContract = new Contract(item.args.assetToken, tokenABI, web3provider);
        const assetTokenSymbol = (await assetTokenContract.symbol());
        const assetTokenDecimals = (await assetTokenContract.decimals());
        const vaultAssetBalance = await assetTokenContract.balanceOf(vaultAddress);
        const vaultAssetBalanceFloat = vaultAssetBalance / (10 ** assetTokenDecimals);

        const vaultValue = vaultDepositBalanceFloat + vaultAssetBalanceFloat * assetPriceFloat;


        tempVaults[vaultAddress] = {
          'address': vaultAddress,
          'depositToken': depositTokenSymbol,
          'depositTokenAddr': item.args.depositToken,
          'assetToken': assetTokenSymbol,
          'assetTokenAddr': item.args.assetToken,
          'depositsValue': formatAccounting(vaultSupply / (10 ** vaultDecimals)),
          'vaultValue': formatAccounting(vaultValue)
        };

        if (!stables.includes(depositTokenSymbol)) {
          stables.push(depositTokenSymbol);
        }

      }));
      setStablecoins(stables);
      setVaults(tempVaults);
      setIsLoading(false);
    }

    fetchData();

  }, [events]);

  useEffect(() => {
    const getEvents = async () => {

      try {
        const web3provider = new Web3Provider(window.ethereum);
        const provider = new JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/NWs3F66Ad5DDc91N-5RVJSSd97xt_n4a');

        const contractABI = VarVaultFactoryABI; // ABI array
        const contractAddress = '0x80dE33bf0b9d7a52F97776e2Ff5f502E507b8544'; // Contract address
        const contract = new Contract(contractAddress, contractABI, provider);

        const eventFilter = contract.filters.VarVaultDeployed();
        const allEvents = await contract.queryFilter(eventFilter, 36248100);

        setEvents(allEvents);

      } catch (error) {
        console.error('Failed to interact with contract:', error);
      }

    };

    getEvents();

  }, []);


  const generateAssetCards = () => {
    const cards: any[] = [];
    if (selectedStablecoin) {
      {
        const filteredVaults: any[] = [];

        Object.keys(vaults).forEach((vaultAddress) => {
          if (vaults[vaultAddress].depositToken == selectedStablecoin) {
            filteredVaults.push(vaults[vaultAddress]);
          }
        })

        Object.keys(filteredVaults).forEach((selectedVault) => (

          cards.push(
            <Card key={`${selectedStablecoin}-${selectedVault}`} sx={{ marginTop: "2rem" }}>
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div> Deposit Token:  </div> < div> {filteredVaults[selectedVault].depositToken} </div> </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div> Collateral:  </div> < div> {filteredVaults[selectedVault].assetToken} </div> </div>

                <Box display="flex" flexDirection="column" marginTop={2} minWidth={300}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}> <div> Historical APY: </div> < div> 5% </div> </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}> <div> Outstanding Deposits: </div> < div> {filteredVaults[selectedVault].depositsValue}</div> </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}> <div> Vault Value:</div> < div> {filteredVaults[selectedVault].vaultValue}</div> </div>
                </Box>
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                  <Button variant="contained" onClick={() => setOpenModalWithdraw(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #e57816 30%, #f0ce34 90%)',
                    }}>
                    Withdraw
                    <WithdrawModal
                      open={openModalWithdraw}
                      onClose={() => { setOpenModalWithdraw(false); }}
                      vaultAddress={filteredVaults[selectedVault].address} />
                  </Button>
                  <Button variant="contained" onClick={() => setOpenModalDeposit(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #001fbb 30%, #3456f0 90%)',
                    }}>
                    Deposit
                    <DepositModal
                      open={openModalDeposit}
                      onClose={() => { setOpenModalDeposit(false); }}
                      vaultAddress={filteredVaults[selectedVault].address}
                      depositTokenAddress={filteredVaults[selectedVault].depositTokenAddr} />
                  </Button>



                </Box>
              </CardContent>
            </Card >
          )
        ));
      }
    }
    return cards;
  };

  // Check if still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "5rem" }}>
      <Card sx={{ padding: "4rem", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
        <FormControl sx={{ borderRadius: "4px" }}>
          <InputLabel>Stablecoin</InputLabel>
          <Select
            value={selectedStablecoin}
            onChange={handleStablecoinChange}
            style={{ minWidth: "120px" }}
          >
            {stablecoins.map((stablecoin) => (
              <MenuItem key={stablecoin} value={stablecoin}>
                {stablecoin}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div >
          {generateAssetCards()}</div>
      </Card>

    </div>

  );


}