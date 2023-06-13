import React, { useState, useEffect } from "react";
import SmartAccount from "@biconomy/smart-account";
import abi from '../utils/counterAbi.json';
import {ethers } from "ethers";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    smartAccount: SmartAccount
    provider: any
  }

const Counter : React.FC<Props> = ({ smartAccount, provider}) => {
    const [ count, setCount ] = useState<number>(0);
    const [ counterContract, setCounterContract ] = useState<any>(null);
    const [ isLoading, setIsLoading] = useState<boolean>(false);
    const counterAddress = "0x250706A3a977703D30980E13830F6E52E078d00f";

    useEffect(() => {
      setIsLoading(true)
      getCount(false)
    },[])
    //  the getCount function creates a contract instance,
    //  sets the state of the contract, fetches the current value of the count from the contract, 
    //  sets the state of the count, and optionally displays a toast notification.
    const getCount = async( isUpdating : boolean) => {
     const contract = new ethers.Contract(
        counterAddress,
        abi,
        provider
     )
     setCounterContract(contract);
     const currentCount = await contract.count();
     setCount(currentCount.toNumber());
     if(isUpdating){
        toast.success('count has been updated!',{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
     }
    }
//The incrementCount function sends a transaction to a smart contract on a blockchain to increment a count,
//waits for the transaction to be confirmed, fetches the updated count, and handles any errors that occur during this process.
    const incrementCount = async () => {
        try {
            toast.info('processing count on the blockchain!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        const incrementTx = await counterContract.populateTransaction.incrementCount()
        const tx1 = {
            to : counterAddress,
            data : incrementTx.data
        }
        const txResponse = await smartAccount.sendTransaction({ transaction : tx1});
        const txHash = await txResponse.wait();
        console.log(txHash, "txHash");
        getCount(true);
        } catch (error) {
            console.log({error}, "error");
            toast.error('error occured check the console', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
    }
    return(
      <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <button onClick={() => incrementCount()}>
        count is {count}
      </button>
      </>
    )
}

export default Counter
