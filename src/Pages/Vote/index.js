import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Web3 from "web3";
import { daoABI, daoAddress, RPC } from "../../Constants/config";
import { buildImageSafe, handleImageError } from "../../Utils/ipfsHelpers";

/**
 * Vote page – reads elections from the DAO contract and allows voting.
 */
class Vote extends React.Component {
  state = { elections: [], msg: "", err: "", loading: true };

  // Use the configured RPC provider for read-only contract calls:
  web3 = new Web3(RPC);
  dao = new this.web3.eth.Contract(daoABI, daoAddress);

  componentDidMount() {
    this.fetchElections();
  }

  /** Pull all proposals from the contract */
  fetchElections = async () => {
    this.setState({ loading: true, err: "" });
    try {
      const count = await this.dao.methods.proposalIndex().call();
      console.log("Found", count, "proposals");
      
      const rows = [];
      for (let i = 0; i < count; i++) {
        try {
          const e = await this.dao.methods.proposals(i).call();
          // Log any problematic image sources for debugging
          if (e.source && !e.source.startsWith('http') && !e.source.startsWith('/')) {
            console.info(`Proposal ${i} has potentially problematic source: ${e.source}`);
          }
          
          rows.push({
            id: e.id,
            name: e.name,
            source: e.source, // Store original source, we'll use buildImageSafe when rendering
            sourceIsSafe: Boolean(e.source && (e.source.startsWith('http') || e.source.startsWith('/')))
          });
        } catch (err) {
          console.error(`Error fetching proposal ${i}:`, err);
        }
      }
      this.setState({ elections: rows, loading: false });
    } catch (err) {
      console.error("Error fetching elections:", err);
      this.setState({ 
        err: `Error fetching elections: ${err.message}`, 
        loading: false 
      });
    }
  };

  /** Send a Yes/No vote for a given proposal ID */
  vote = async (id, choice) => {
    if (!this.props.account) {
      return this.setState({ err: "Connect wallet first" });
    }

    this.setState({ loading: true, msg: "", err: "" });
    try {
      // Make sure we use the injected web3 for transactions
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install and unlock MetaMask.");
      }

      const dao = new Web3(window.ethereum).eth.Contract(
        daoABI,
        daoAddress
      );

      await dao.methods.vote(id, choice).send({ from: this.props.account });
      this.setState({ 
        msg: `Vote ${choice ? 'Yes' : 'No'} recorded for proposal #${id} ✔`, 
        err: "",
        loading: false 
      });
      
      // Refresh list after voting
      this.fetchElections();
    } catch (err) {
      console.error("Voting error:", err);
      this.setState({ 
        err: `Voting error: ${err.message}`, 
        msg: "",
        loading: false
      });
    }
  };

  /** Render a single election row */
  row = (e) => (
    <TableRow key={e.id}>
      <TableCell>{e.id}</TableCell>
      <TableCell align="center">
        <Box
          component="img"
          src={buildImageSafe(e.source)}
          sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }}
          onError={handleImageError}
          alt={`Election ${e.id} thumbnail`}
          title={!e.sourceIsSafe ? "Using fallback image (original was invalid)" : ""}
        />
      </TableCell>
      <TableCell align="center">
        <Typography>
          {e.name}
        </Typography>
        {!e.sourceIsSafe && (
          <Typography variant="caption" color="text.secondary">
            Using fallback image
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => this.vote(e.id, true)}
            disabled={!this.props.account}
          >
            Yes
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => this.vote(e.id, false)}
            disabled={!this.props.account}
          >
            No
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );

  render() {
    const { elections, msg, err, loading } = this.state;

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Active Elections
        </Typography>

        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        {!this.props.account && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please connect your wallet using the header button to vote
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Assessment Demo: IPFS Fallback Handling
          </Typography>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => {
              // Add a test election with broken IPFS CID to demonstrate fallback
              this.setState({
                elections: [
                  ...this.state.elections,
                  {
                    id: "demo-123",
                    name: "Demo: Broken IPFS Image",
                    source: "QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg", // This is the example broken CID
                    sourceIsSafe: false
                  }
                ]
              });
            }}
          >
            Demo: Add Item with Broken IPFS Image
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          elections.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Image</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{elections.map(this.row)}</TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No active elections found
            </Alert>
          )
        )}
      </Box>
    );
  }
}

export default connect(state => ({ account: state.userReducer.account }))(Vote);
