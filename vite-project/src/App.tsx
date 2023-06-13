import "./App.css";
import "@biconomy/web3-auth/dist/src/style.css";
import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";
import Counter from "./Components/Counter";
import "./App.css";

function App() {
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [interval, enableInterval] = useState<boolean>(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    let configureLogin: any;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  //The login function is an asynchronous function that handles the login flow for the application.
  //1) SDK Initialization: The function first checks if the sdkRef object (which is a reference to the Biconomy SDK instance) is null. If it is, it means that the SDK is not yet initialized. In this case, it creates a new instance of SocialLogin (a Biconomy SDK component), whitelists a local URL (http://127.0.0.1:5173/), and initializes the SDK with the Polygon Mumbai testnet configuration and the whitelisted URL. After initialization, it assigns the SDK instance to sdkRef.current.
  //2) Provider Check: After ensuring the SDK is initialized, the function checks if the provider of the sdkRef object is set. If it is not, it means the user is not yet logged in. It then shows the wallet interface for the user to login using sdkRef.current.showWallet(), and enables the interval by calling enableInterval(true). This interval (setup in a useEffect hook elsewhere in the code) periodically checks if the provider is available and sets up the smart account once it is.
  //3) Smart Account Setup: If the provider of sdkRef is already set, it means the user is logged in. In this case, it directly sets up the smart account by calling setupSmartAccount().

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSdk = new SocialLogin();
      const signature1 = await socialLoginSdk.whitelistUrl('http://192.168.66.203:5173/');
      await socialLoginSdk.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          'http://192.168.66.203:5173/': signature1,
        }
      })
      sdkRef.current = socialLoginSdk
    }
    if(!sdkRef.current.provider){
      sdkRef.current.showWallet();
      enableInterval(true)
    } else {
      setupSmartAccount();
    }
  }
// The setupSmartAccount function checks the availability of the Biconomy provider, hides the wallet interface, sets up a Web3 provider, creates and initializes a smart account,
// and then saves this account and the Web3 provider in the state. If any error occurs during this process, 
// it is logged to the console.

async function setupSmartAccount() {
      if(!sdkRef?.current?.provider)return 
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    setProvider(web3Provider);
    try {
      const smartAccount = new SmartAccount(web3Provider,{
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig : [
          {
            chainId : ChainId.POLYGON_MUMBAI,
            dappAPIKey : "n_VIvJoCV.df444988-820b-4c29-a0de-4ae1d2607924"
          },
        ],
      })
      await smartAccount.init();
       setSmartAccount(smartAccount);
       setLoading(false);
    } catch (error) {
      console.log("err setting up Smart Account....", error);
    }
  };

  //  The logout function checks if the SDK is initialized, logs the user out and hides the wallet if it is,
  //  and then clears the smart account and disables the interval. If the SDK is not initialized, 
  //  it logs an error message and does not execute the rest of the function.
 
  const logout = async() => {
  if(!sdkRef.current){
    console.log("Web3Modal not initialized");
    return
  }
  await sdkRef.current.logout();
  sdkRef.current.hideWallet();
  setSmartAccount(null);
  enableInterval(false);
  }

  return (
    <div>
      <h1>Biconomy SDK Auth + Gasless Transactions</h1>
      {
        !smartAccount && !loading && <button onClick = {login}>Login</button>
      }
      {
        loading && <p>Loading account details..</p>
      }
      {
        !!smartAccount && (
          <div className = "buttonWrapper">
           <h3>Smart account address : </h3>
            <p>{smartAccount.address}</p>
            <Counter smartAccount={smartAccount} provider = {provider} />
            <button onClick = { logout }>Logout</button>
          </div>
        )
      }
        <p>
      Edit <code>src/App.tsx</code> and save to test
      </p>
      <a href="https://biconomy.gitbook.io/sdk/introduction/overview" target="_blank" className="read-the-docs">
  Click here to check out the docs
    </a>
    </div>
  )
}

export default App;
