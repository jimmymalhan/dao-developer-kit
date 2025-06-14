/**
 * IPFS Helper Functions
 * Provides utilities for validating and handling IPFS URIs and images safely.
 */

// Default fallback image path
export const FALLBACK_IMAGE = "/images/election.png";

/**
 * Validates if a string appears to be a valid IPFS CID
 * @param {string} cid - The potential IPFS CID to validate
 * @returns {boolean} - Whether the CID appears valid
 */
export const isValidCID = (cid) => {
  if (!cid || typeof cid !== 'string') return false;
  
  // Remove any protocol prefixes for validation
  const cleanCid = cid.replace(/^ipfs:\/\/|^https:\/\/ipfs.io\/ipfs\/|^https:\/\/vrdao.mypinata.cloud\/ipfs\//, '');
  
  // Simple regex validation for CID v0 or v1
  // This is a basic check - for production use a more robust CID validation
  return /^(Qm[1-9A-Za-z]{44}|bafy[a-zA-Z0-9]{55})/.test(cleanCid);
};

/**
 * Safely builds an image URL with fallback for IPFS resources
 * @param {string} source - The original image source (could be IPFS URI or direct URL)
 * @returns {string} - A safe URL to use as image source
 */
export const buildImageSafe = (source) => {
  // If source is empty or not a string, use fallback
  if (!source || typeof source !== 'string') {
    return FALLBACK_IMAGE;
  }
  
  // If already a valid http URL or local path, use it directly
  if (source.startsWith('http') || source.startsWith('/')) {
    return source;
  }
  
  // If it's an IPFS URI, validate the CID
  if (source.startsWith('ipfs://')) {
    const cid = source.replace('ipfs://', '');
    return isValidCID(cid) 
      ? `https://vrdao.mypinata.cloud/ipfs/${cid}`
      : FALLBACK_IMAGE;
  }
  
  // If it's already an IPFS CID without protocol
  if (isValidCID(source)) {
    return `https://vrdao.mypinata.cloud/ipfs/${source}`;
  }
  
  // Default to fallback if we can't determine a valid source
  return FALLBACK_IMAGE;
};

/**
 * Handles image loading errors by setting the fallback image
 * @param {Event} event - The error event from the img element
 */
export const handleImageError = (event) => {
  console.log('Image loading error, using fallback');
  event.currentTarget.src = FALLBACK_IMAGE;
};
