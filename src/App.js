/*
 * We are going to need to use state now! Don't forget to import useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import twitterLogo from "./assets/twitter-logo.svg";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = "_dungeonslayer";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [networkStatus, setNetworkStatus] = useState(false);
  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  //Render Methods
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    /**
     * Scenario 1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://c.tenor.com/O6Yh4R9EQG4AAAAC/dungeons-dragons-dnd.gif"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (!networkStatus) {
      return (
        <div className="connect-wallet-container">
          <p className="sub-text">
            Connect to the Rinkeby Ethereum Test Network and reload this page!
          </p>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />

        // <div className="character-item" key={characterNFT.name}>
        //   <div align="center" className="name-container">
        //     <p align="center">{characterNFT.name}</p>
        //   </div>
        //   <img src={characterNFT.imageURI} alt={characterNFT.name}/>
        //   <button
        //     type="button"
        //     className="character-view-button"
        //   >View NFT</button>
        // </div>
      );
    }
  };

  /*
   * Implement connectWallet method
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Contract interations UseEffect
  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        setCharacterNFT(transformCharacterData(txn));
        console.log(`User has character NFT ${transformCharacterData(txn)}`);
      } else {
        console.log("No character NFT found");
      }

      setIsLoading(false);
    };

    const checkNetwork = async () => {
      try {
        //if wallet is connected
        if (currentAccount) {
          if (window.ethereum.networkVersion !== "4") {
            setNetworkStatus(false);
          } else {
            setNetworkStatus(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      checkNetwork();
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Dungeons Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {/*
           * Button that we will use to trigger wallet connect
           * Don't forget to add the onClick event to call your method!
           */}
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
