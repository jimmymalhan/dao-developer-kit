import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { getEthereum, requestAccounts } from '../../Utils/web3Provider';

class Header extends React.Component {
  state = { connecting: false, error: '' };

  connectWallet = async () => {
    const eth = getEthereum();
    if (!eth) return this.setState({ error: 'MetaMask not detected' });

    try {
      this.setState({ connecting: true, error: '' });
      const [addr] = await requestAccounts();
      this.props.dispatch({ type: 'SET_ACCOUNT', payload: addr });
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ connecting: false });
    }
  };

  componentDidMount() {
    const eth = getEthereum();
    if (!eth) return;
    this.handleAccountsChanged = (accts) => {
      const addr = accts.length ? accts[0] : '';
      this.props.dispatch({
        type: addr ? 'SET_ACCOUNT' : 'RESET_ACCOUNT',
        payload: addr
      });
    };
    eth.on('accountsChanged', this.handleAccountsChanged);
  }

  componentWillUnmount() {
    const eth = getEthereum();
    if (eth && this.handleAccountsChanged) {
      eth.removeListener('accountsChanged', this.handleAccountsChanged);
    }
  }

  render() {
    const { account } = this.props;
    const { connecting } = this.state;

    return (
      <AppBar position='static'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h6'>Vegan Rob's DAO</Typography>
          {account ? (
            <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
              {account.slice(0, 6)}…{account.slice(-4)}
            </Typography>
          ) : (
            <Button
              variant='contained'
              color='secondary'
              disabled={connecting}
              onClick={this.connectWallet}
            >
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(state => ({ account: state.userReducer.account }))(Header);
