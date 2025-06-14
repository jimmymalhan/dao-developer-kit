/* ipfsTest.js - A simple test utility to demonstrate our IPFS CID validation and fallback behavior
 * 
 * This file is not used in production - it's purely for demonstration purposes
 * to show how we handle IPFS CIDs and implement fallback image logic.
 */

import { isValidCID, buildImageSafe, FALLBACK_IMAGE } from './Utils/ipfsHelpers';

// Test valid CIDs
const validCIDv0 = 'QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg';
const validCIDv1 = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';

// Test invalid CIDs
const invalidCID = '123invalidcid';
const brokenCID = 'QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg123';

// Test different URL formats
const httpUrl = 'https://example.com/image.png';
const localPath = '/images/election.png';
const ipfsUrl = 'ipfs://QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg';
const pinataUrl = 'https://vrdao.mypinata.cloud/ipfs/QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg';

/**
 * Run validation tests and log results
 */
const runTests = () => {
  console.log('\n--- IPFS CID Validation Tests ---\n');
  
  console.log('Valid CIDs:');
  console.log(`CID v0 (${validCIDv0}): ${isValidCID(validCIDv0) ? 'VALID ✅' : 'INVALID ❌'}`);
  console.log(`CID v1 (${validCIDv1}): ${isValidCID(validCIDv1) ? 'VALID ✅' : 'INVALID ❌'}`);
  
  console.log('\nInvalid CIDs:');
  console.log(`Basic invalid (${invalidCID}): ${isValidCID(invalidCID) ? 'VALID ❌' : 'INVALID ✅'}`);
  console.log(`Almost valid (${brokenCID}): ${isValidCID(brokenCID) ? 'VALID ❌' : 'INVALID ✅'}`);
  
  console.log('\n--- Image URL Safety Tests ---\n');
  
  console.log('Checking different URL formats:');
  console.log(`HTTP URL: ${buildImageSafe(httpUrl)}`);
  console.log(`Local Path: ${buildImageSafe(localPath)}`);
  console.log(`IPFS URL: ${buildImageSafe(ipfsUrl)}`);
  console.log(`Pinata URL: ${buildImageSafe(pinataUrl)}`);
  console.log(`Invalid CID: ${buildImageSafe(invalidCID)}`);
  console.log(`Empty String: ${buildImageSafe('')}`);
  console.log(`Null value: ${buildImageSafe(null)}`);
  
  console.log('\nFallback image path:', FALLBACK_IMAGE);
  
  console.log('\n--- Problematic CIDs from seed data ---\n');
  
  // This is the example CID mentioned in the README
  const badExampleCID = 'QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg';
  console.log(`README example (${badExampleCID}): ${isValidCID(badExampleCID) ? 'VALID ✅' : 'INVALID ❌'}`);
  console.log(`Built URL: ${buildImageSafe(badExampleCID)}`);
  console.log(`Gateway URL: https://ipfs.io/ipfs/${badExampleCID} (returns 422 error)`);
};

export default runTests;
