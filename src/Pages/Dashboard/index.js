import React from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { daoABI, daoAddress, RPC } from '../../Constants/config';
import { Box, Typography, Grid, Card, CardContent, CardHeader } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

class Dashboard extends React.Component {
  state = { 
    owner: '', 
    totalProposals: 0,
    tokenHolders: 0,
    err: '' 
  };
  
  web3 = new Web3(RPC);

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.account && this.props.account !== prevProps.account) {
      this.init();
    }
  }

  init = async () => {
    try {
      // Always create a fresh contract instance
      const daoContract = new this.web3.eth.Contract(daoABI, daoAddress);
      
      // Try lowercase owner() first, which is standard Solidity naming convention
      let ownerAddr;
      try {
        ownerAddr = await daoContract.methods.owner().call();
      } catch (err) {
        console.warn('owner() method not found, trying Owner():', err);
        try {
          // If lowercase doesn't work, try uppercase Owner() as fallback
          ownerAddr = await daoContract.methods.Owner().call();
        } catch (subErr) {
          console.error('Neither owner() nor Owner() method found:', subErr);
          throw new Error('Could not fetch owner address');
        }
      }
      
      // Get total proposals if possible
      let proposalCount = 0;
      try {
        proposalCount = await daoContract.methods.proposalIndex().call();
      } catch (err) {
        console.warn('Could not fetch proposal count:', err);
      }

      this.setState({ 
        owner: ownerAddr, 
        totalProposals: proposalCount,
        err: '' 
      });
    } catch (err) {
      console.error('Dashboard init error:', err);
      this.setState({ err: `Error: ${err.message}` });
    }
  };

  render() {
    const { owner, totalProposals, err } = this.state;
    const { account } = this.props;
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          VeganRob DAO Dashboard
        </Typography>
        
        {err && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error.main">{err}</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader 
                title="DAO Owner" 
                avatar={<AccountBalanceWalletIcon color="success" />}
              />
              <CardContent>
                {owner ? (
                  <Typography variant="body2" noWrap>
                    {owner}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Loading owner...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader 
                title="Total Proposals" 
                avatar={<AssignmentIcon color="primary" />}
              />
              <CardContent>
                <Typography variant="h4">
                  {totalProposals}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader 
                title="Your Wallet" 
                avatar={<AccountBalanceWalletIcon color="warning" />}
              />
              <CardContent>
                {account ? (
                  <Typography variant="body2" noWrap>
                    {account}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Not connected
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader 
                title="Active Votes" 
                avatar={<HowToVoteIcon color="error" />}
              />
              <CardContent>
                <Typography variant="body2">
                  {account ? "Check the Vote page" : "Connect wallet to vote"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default connect(state => ({ account: state.userReducer.account }))(Dashboard);
