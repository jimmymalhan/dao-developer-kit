import React from "react";
import {
  Alert,
  Box,
  Button,
  Typography,
  Stack,
  TextareaAutosize,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { pinFileToIPFS } from "../../Utils/pinata";
import { isValidCID } from "../../Utils/ipfsHelpers";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { RPC, daoABI, daoAddress } from "../../Constants/config";
const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const daoContract = new web3.eth.Contract(daoABI, daoAddress);

class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      content: "",
      files: [],
      owner: "",
      admin: "",
      preview: "",
      loading: false,
      error: "",
      success: ""
    };
    this.handleContent = this.handleContent.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  handleFile(e) {
    const preview = URL.createObjectURL(e.target.files[0]);
    console.log(preview);
    this.setState({
      files: e.target.files,
      preview: preview,
    });
  }

  async componentWillMount() {
    const owner = await daoContract.methods.owner().call();
    const admin = await daoContract.methods.admin().call();
    this.setState({
      owner: owner,
      admin: admin,
    });
  }

  async handleCreate(e) {
    e.preventDefault();
    
    this.setState({ loading: true, error: "", success: "" });
    
    try {
      // Input validation
      if (!this.state.content) {
        this.setState({ error: "Please enter election content", loading: false });
        return;
      }
      
      if (!this.state.files || !this.state.files.length) {
        this.setState({ error: "Please select an image file", loading: false });
        return;
      }
      
      // Permission check
      if (this.state.owner === "" || this.state.admin === "") {
        this.setState({ error: "Contract owner or admin not found", loading: false });
        return;
      }

      // Check if user has permission to create proposals
      if (
        this.state.owner !== "" &&
        this.state.owner !== this.props.account &&
        this.state.admin !== "" &&
        this.state.admin !== this.props.account
      ) {
        this.setState({ error: "You do not have permission to create proposals", loading: false });
        return;
      }
      
      // Upload to IPFS via Pinata
      const response = await pinFileToIPFS(this.state.files[0]);

      if (response.success) {
        // Validate the returned CID
        if (!isValidCID(response.pinataUrl)) {
          this.setState({ 
            error: "Invalid IPFS CID received from Pinata", 
            loading: false 
          });
          return;
        }
        
        this.setState({ success: "Image uploaded to IPFS successfully" });
        
        // Switch to the correct chain if needed
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(1666600000) }],
        });

        // Create the proposal
        const linkedContract = new window.web3.eth.Contract(daoABI, daoAddress);
        await linkedContract.methods
          .createProposal(this.state.content, response.pinataUrl)
          .send({ from: this.props.account })
          .once("confirmation", async () => {
            this.setState({ success: "Proposal created successfully!", loading: false });
            this.props.navigate("/elections");
          });
      } else {
        this.setState({ 
          error: response.message || "Failed to upload image to IPFS", 
          loading: false 
        });
      }
    } catch (err) {
      console.error("Error creating proposal:", err);
      this.setState({ 
        error: `Error: ${err.message}`, 
        loading: false 
      });
    }
  }

  render() {
    const { loading, error, success } = this.state;
    
    return (
      <Box
        sx={{
          p: 1.5,
          pb: 7,
          bgcolor: this.props.theme.palette.background.neutral,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <Stack
          sx={{
            px: this.props.matchUpMd ? 5 : 2,
            pt: 2,
            bgcolor: this.props.theme.palette.background.default,
          }}
        >
          <Typography variant="h3">Create New Election</Typography>
          <Box sx={{ pt: 3 }} component="form" onSubmit={this.handleCreate}>
            <Box>
              {this.state.admin !== "" &&
              this.props.account !== this.state.admin &&
              this.state.owner !== "" &&
              this.props.account !== this.state.owner ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  You have no permission to create an Election.
                </Alert>
              ) : (
                <></>
              )}

              <Typography variant="subtitle1">1. Attachments</Typography>
              <Stack
                flexDirection={this.props.matchUpMd ? "row" : "column"}
                gap={3}
                alignItems="flex-start"
                sx={{ pt: 2 }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: "100%",
                    maxWidth: 260,
                    height: "100%",
                    maxHeight: 220,
                    borderRadius: 2,
                    p: 2,
                    border: `1px solid ${this.props.theme.palette.divider}`,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      this.state.preview
                        ? this.state.preview
                        : "/images/election.png"
                    }
                    sx={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </Stack>
                <Stack flexDirection="row" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      borderColor: this.props.theme.palette.divider,
                      color: this.props.theme.palette.text.primary,
                    }}
                  >
                    Upload File
                    <input
                      type="file"
                      hidden
                      name="file"
                      onChange={this.handleFile}
                    />
                  </Button>
                  <Typography
                    sx={{
                      color: this.props.theme.palette.text.secondary,
                    }}
                  >
                    {this.state.files[0]
                      ? this.state.files[0].name
                      : "No file chosen"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ pt: 5 }}>
              <Typography variant="subtitle1">2. Content</Typography>
              <Box sx={{ pt: 2 }}>
                <TextareaAutosize
                  placeholder="Please input content of Election"
                  minRows={5}
                  required
                  cols={5}
                  onChange={this.handleContent}
                  value={this.state.content}
                  style={{
                    color: this.props.theme.palette.text.primary,
                    borderRadius: 8,
                    fontSize: 18,
                    fontFamily: "Inter",
                    padding: 16,
                    backgroundColor: "transparent",
                    width: "100%",
                  }}
                >
                  {this.state.content}
                </TextareaAutosize>
              </Box>
            </Box>
            <Box sx={{ py: 4 }}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={
                  (this.state.admin !== "" &&
                    this.state.admin === this.props.account) ||
                  (this.state.owner !== "" &&
                    this.state.owner === this.props.account)
                    ? false
                    : true
                }
                // disabled={true}
                sx={{
                  color: this.props.theme.palette.common.white,
                }}
              >
                Create New Election
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  }
}

const withHook = (Component) => {
  return (props) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
    const navigate = useNavigate();
    const { account } = useSelector((state) => state.userReducer);

    return (
      <Component
        theme={theme}
        navigate={navigate}
        account={account}
        matchUpMd={matchUpMd}
        {...props}
      />
    );
  };
};
export default withHook(Create);
