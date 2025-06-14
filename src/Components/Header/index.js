import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getEthereum } from '../../Utils/web3Provider';

const Header = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const ethereum = getEthereum();
    if (ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected all accounts
          dispatch({ type: 'RESET_ACCOUNT' });
        }
      };
      
      ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Cleanup listener on component unmount
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [dispatch]);
  
  return (
    <div>
      {/* ...existing header content... */}
    </div>
  );
};

export default Header;