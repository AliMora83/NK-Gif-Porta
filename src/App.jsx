import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

const TEST_GIFS = [
	'https://media.giphy.com/media/ispEc1253326c/giphy.gif','https://media.giphy.com/media/26ufplp8yheSKUE00/giphy.gif','https://media.giphy.com/media/QUg4NZUjwRmuBswyYc/giphy.gif','https://media.giphy.com/media/4gsjHZMPXdlGo/giphy.gif','https://media.giphy.com/media/TTedQxhzd5T4A/giphy.gif','https://media.giphy.com/media/wyWFrlf9heRPi/giphy.gif','https://media.giphy.com/media/PnUatAYWMEMvmiwsyx/giphy.gif','https://media.giphy.com/media/xuK0uWYApXbE6mMODf/giphy.gif','https://media.giphy.com/media/4Ev0Ari2Nd9io/giphy.gif','https://media.giphy.com/media/eR7OEDQDyA7Cg/giphy.gif',,
]

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = 'swarts_d';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Is phantom wallet connected?
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        /*
         * Set the user's publicKey in state to be used later!
         */
        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (err) {
      console.log('err');
  }
};

    // Connect Wallet Logic
  const connectWallet = async () => {
    // Render UI when user wallet is not connected
    const {solana} = window;

    if(solana) {
      const response = await solana.connect();
      console.log('Connected with pubKey:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Get Input Change
  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

const renderConnectedContainer = () => {
   return <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
};
  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.
    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);

  return (
  <div className="App">
   <div className="container">
        <div className="header-container">
          <p className="header">NAMKA PORTAL</p>
          <p className="sub-text">
            🏆Welcome to our MetaVerse. View our GIF collections here ✨🏹
          </p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
