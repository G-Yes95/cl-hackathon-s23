import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import NavBar from '../src/NavBar';
import { Button } from '@mui/material';
import Background from '../src/Background';

export default function Home() {
  return (
    <>
      <div style={{ zIndex: -1, position: "fixed" }}>
        <Background />
      </div>
      <NavBar />

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
          <Typography variant="h4" component="h1" gutterBottom>
            Chainlink Hackathon Spring 2023 Submission
          </Typography>

          <Box maxWidth="sm">
            <Button variant="contained" component={Link} noLinkStyle href="/dapp">
              Launch App
            </Button>
          </Box>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
