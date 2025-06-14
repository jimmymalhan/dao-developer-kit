import { pinata_key, pinata_secret } from "../Constants/config";
import axios from "axios";
import { isValidCID } from "./ipfsHelpers";

/**
 * Uploads a file to IPFS using the Pinata pinning service
 * 
 * @param {File} file - The file to upload to IPFS
 * @returns {Object} - Result object with success status and IPFS URL or error message
 */
export const pinFileToIPFS = async (file) => {
  // Validate input
  if (!file) {
    return {
      success: false,
      message: "No file provided"
    };
  }
  
  // Check if API keys are configured
  if (!pinata_key || !pinata_secret) {
    console.warn("Pinata API keys not configured in environment variables");
    return {
      success: false,
      message: "IPFS pinning service credentials not configured"
    };
  }

  // Create form data for the file
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let formData = new FormData();
  formData.append("file", file);

  try {
    // Add metadata to help identify the file source
    const metadata = JSON.stringify({
      name: file.name || "Vegan Rob's DAO Election Image",
      keyvalues: {
        app: "VeganRobDAO",
        timestamp: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Upload to Pinata
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: pinata_key,
        pinata_secret_api_key: pinata_secret,
      },
      maxContentLength: Infinity, // For larger files
    });
    
    // Validate the IPFS hash
    const ipfsHash = response.data.IpfsHash;
    if (!ipfsHash || !isValidCID(ipfsHash)) {
      throw new Error("Invalid IPFS hash received from Pinata");
    }
    
    const pinataUrl = `https://vrdao.mypinata.cloud/ipfs/${ipfsHash}`;
    
    // Log success for tracking
    console.log(`File successfully pinned to IPFS with CID: ${ipfsHash}`);
    console.log(`Accessible at: ${pinataUrl}`);
    
    return {
      success: true,
      pinataUrl,
      ipfsHash,
      gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`
    };
  } catch (error) {
    // Detailed error handling
    console.error("Error pinning file to IPFS:", error);
    
    // Format a user-friendly error message
    let errorMessage = "Failed to upload to IPFS";
    if (error.response) {
      // The request was made and the server responded with an error status
      errorMessage = `Pinata server error: ${error.response.status} - ${error.response.data.error || "Unknown error"}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from IPFS pinning service. Check your internet connection";
    } else {
      // Something else caused the error
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};
