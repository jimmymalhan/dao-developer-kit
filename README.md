# Vegan-Robs-Dao-New

## Known Dev-Only Vulnerabilities

This project uses development tools (Ganache, Truffle, Webpack dev server) that may report security vulnerabilities during `npm audit`. These warnings are safe to ignore for demonstration purposes because:

- These dependencies are only used during local development
- They are not included in the production build
- The vulnerabilities do not affect the application's runtime security

The reported CVEs are isolated to development tooling and do not impact the security of the deployed application.

**Note:** These vulnerabilities should be addressed before deploying to production.

## Security Notes

Dev-only dependencies report CVEs via npm-audit. They are isolated from the production bundle and safe for this assessment demo.

## Technical Notes

### Image Handling
- The application includes graceful fallback handling for election images
- Invalid IPFS CIDs in seed data are automatically replaced with a default image
- This ensures consistent UI presentation without modifying source data
- Frontend validation prevents broken image links while preserving data integrity

## ✅ Vegan Rob's DAO – Assessment Demo Checklist

### Start with Setup (1 minute)
- Project runs clean with npm install && npm run start
- MetaMask is installed and connected
- .env is configured with working API and contract values
- Backend (Mongo + Node) connects without errors
- Frontend loads at localhost:3000 with no red console errors

### Election View (2 minutes)
- Navigate to Vote tab
- Show the pre-seeded election question (e.g. Harmony grant)
- Note: Mention the broken image from seed data
- Show how you added a fallback image to handle bad CID
- Explain that you did not alter their seed data — only patched the user experience
- Bonus: Show the broken CID returns 422 on IPFS gateway
https://ipfs.io/ipfs/QmPyj3DrYwou8ruEJDYYR17R4e7FEMaVsj1q7e74s1Tg

### Wallet Connection (1 minute)
- Click Connect Wallet
- MetaMask opens and links an account
- Displayed wallet address updates in UI (0x... format)

### Voting Flow (2–3 minutes)
- Click Yes or No
- MetaMask transaction appears
- Confirm voting triggers smart contract write
- Show a toast/success/failure message if present
- Bonus: Check vote count updates if hooked to backend/contract

### Bonus Features (optional but impressive)
- Show fallback image logic in code (buildImageSafe)
- Mention added IPFS CID validation to avoid UI bugs
- Show how account changes trigger UI state reset
- Mention any improvements you would make (e.g. pagination, loading states)

## Application Setup

metmask -pass - gr3atApple99

lsof -ti :4000 | xargs kill -9
lsof -ti :3000 | xargs kill -9 
lsof -ti :8545 | xargs kill -9

npm install // optional

npx --yes ganache \
  --server.port 8545 \
  --chain.chainId 1337 \
  --wallet.mnemonic "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"


npx truffle migrate --network development --reset

update - 
REACT_APP_DAO_CONTRACT=<DAO address>
REACT_APP_TOKEN_CONTRACT=<Token addr>



npm run start-server
1 Click the MetaMask fox icon in your browser toolbar

2 Choose “Create a new wallet”

Enter password gr3atApple99 twice

Write down the secret phrase MetaMask shows – safety first

3 Unlock MetaMask with that password

4 Add the local chain

Click the circle avatar top right – choose “Settings”

Select “Networks” then “Add network”

Fill in

Network name – Local 1337

RPC URL – http://127.0.0.1:8545

Chain ID – 1337

Currency symbol – ONE (or leave blank)

Save – MetaMask switches to Local 1337

5 Import your Ganache account

Ganache terminal shows private keys – copy the first one

In MetaMask click the circle avatar – choose “Import account”

Paste the private key – click “Import”

6 Refresh your React app page

Header now shows the address of that imported account

Click “Connect Wallet” if prompted – approve in MetaMask