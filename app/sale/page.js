"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createSellOrder, addGenStation, getSLRTokenBalance } from "../../utils";
import { ToastContainer, toast, Slide, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

export default function Main() {
  const [SLRBalance, setSLRBalance] = useState("Fetching ...");
  const [noOfTokens, setNoOfTokens] = useState(0);
  const [price, setPrice] = useState('');
  const [isOption, setIsOption] = useState(false);
  const [optionPrice, setOptionPrice] = useState('');
  const [optionDuration, setOptionDuration] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [validationError, setValidationError] = useState('');

  async function handleSLRBalanceUpdate() {
    console.log("Fetching SLR token balance...");
    try {
      const updatedBalance = await getSLRTokenBalance();
      console.log("Fetched balance:", updatedBalance);
      setSLRBalance(updatedBalance);
    } catch (error) {
      console.error("Failed to fetch SLR token balance:", error);
    }
  }

  async function handleSubmit() {
    // Validate inputs before submitting
    if (!validateInputs()) {
      return;
    }
    
    try {
      await createSellOrder(
        Number(noOfTokens), 
        price, 
        toggle ? optionPrice : 0, 
        toggle ? Number(optionDuration) : 0
      );
      
      toast.success('Sale created successfully!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      
      // Reset form
      setPrice('');
      setNoOfTokens(0);
      setOptionPrice('');
      setOptionDuration(0);
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error('Failed to create sale. Please try again.', {
        position: "bottom-right",
        theme: "dark",
      });
    }
  }

  function validateInputs() {
    // Validate token amount
    if (!noOfTokens || Number(noOfTokens) <= 0) {
      setValidationError('Number of tokens must be greater than 0');
      return false;
    }
    
    // Validate price
    if (!price || Number(price) <= 0) {
      setValidationError('Price must be greater than 0');
      return false;
    }
    
    // Validate option fields if toggle is on
    if (toggle) {
      if (!optionPrice || Number(optionPrice) <= 0) {
        setValidationError('Option price must be greater than 0');
        return false;
      }
      
      if (!optionDuration || Number(optionDuration) <= 0) {
        setValidationError('Option duration must be greater than 0');
        return false;
      }
    }
    
    setValidationError('');
    return true;
  }

  function handleNoOfTokenUpdate(value) {
    // Only allow positive integer values
    const parsedValue = parseInt(value);
    const newValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
    setNoOfTokens(newValue);
  }

  function handlePriceUpdate(value) {
    // Allow decimal values for ETH prices
    // Remove any non-numeric characters except for decimal point
    let formattedValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const decimalPointCount = (formattedValue.match(/\./g) || []).length;
    if (decimalPointCount > 1) {
      const splitValue = formattedValue.split('.');
      formattedValue = splitValue[0] + '.' + splitValue.slice(1).join('');
    }
    
    // Limit to 18 decimal places for ETH
    if (formattedValue.includes('.')) {
      const parts = formattedValue.split('.');
      if (parts[1].length > 18) {
        formattedValue = parts[0] + '.' + parts[1].substring(0, 18);
      }
    }
    
    setPrice(formattedValue);
  }

  function handleOptionPriceUpdate(value) {
    // Apply same formatting for option price
    let formattedValue = value.replace(/[^\d.]/g, '');
    
    const decimalPointCount = (formattedValue.match(/\./g) || []).length;
    if (decimalPointCount > 1) {
      const splitValue = formattedValue.split('.');
      formattedValue = splitValue[0] + '.' + splitValue.slice(1).join('');
    }
    
    if (formattedValue.includes('.')) {
      const parts = formattedValue.split('.');
      if (parts[1].length > 18) {
        formattedValue = parts[0] + '.' + parts[1].substring(0, 18);
      }
    }
    
    setOptionPrice(formattedValue);
  }

  function handleOptionDurationUpdate(value) {
    // Only allow positive integer values for duration
    const parsedValue = parseInt(value);
    const newValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
    setOptionDuration(newValue);
  }

  useEffect(() => {
    handleSLRBalanceUpdate();
  }, []);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="h-max-screen w-full bg-black">
      <Navbar />
      <ToastContainer />
      
      <div className="mt-36 text-white items-center justify-center w-full">
        <div className="text-4xl font-extrabold tracking-wide lg:text-5xl text-center border-1 rounded-md content-center font-Roboto p-2 border-2 mx-48 py-5 border-white">
          You have generated <mark className="px-5 rounded-lg bg-white"><span className="text-green-600">{SLRBalance}</span></mark>{" "}
          SLR Points{" "}
        </div>
        <div className="text-4xl font-roboto text-center font-extrabold">( SXCH Tokens after X-chain Launch )</div>

        <div className="flex flex-row ml-96 mb-16">
          <div className="ml-20 w-1/2 mt-12 bg-zinc-900 p-6">
            <label
              htmlFor="default-input"
              className="block mb-6 font-roboto font-semibold tracking-tight text-white text-center text-4xl"
            >
              List Sales
            </label>

            {validationError && (
              <div className="mb-4 p-3 bg-red-700 text-white rounded-lg">
                {validationError}
              </div>
            )}

            <div className="border-2 p-8 w-full bg-[#ddaf26] rounded-lg">
              <div className="flex flex-col">
                <label htmlFor="noOfTokensField" className="text-xl font-semibold mt-5 text-white">
                  No of Tokens
                </label>
                <input
                  type="number"
                  id="noOfTokensField"
                  placeholder="No of tokens"
                  value={noOfTokens}
                  onChange={(e) => handleNoOfTokenUpdate(e.target.value)}
                  className="mt-2 mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-md font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />

                <label htmlFor="priceField" className="text-xl mt-5 font-semibold text-white">
                  Total Price (ETH-SXCH , after X-chain launch)
                </label>
                <input
                  type="text"
                  id="priceField"
                  placeholder="Total price (ETH)"
                  value={price}
                  onChange={(e) => handlePriceUpdate(e.target.value)}
                  className="mt-2 mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-md font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />

                <label htmlFor="toggle" className="inline-flex items-center cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    id="toggle"
                    checked={toggle}
                    onChange={handleToggle}
                  />
                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-xl font-semibold text-white">
                    Offer as Option
                  </span>
                </label>

                <div className={`w-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${toggle ? 'max-h-screen' : 'max-h-0'}`}>
                  <label htmlFor="optionPriceField" className="text-xl font-semibold mt-5 text-white">
                    Price for Option (ETH-SXCH , after X-chain)
                  </label>
                  <input
                    type="text"
                    id="optionPriceField"
                    placeholder="Option price (ETH)"
                    value={optionPrice}
                    onChange={(e) => handleOptionPriceUpdate(e.target.value)}
                    className="mt-2 mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />

                  <label htmlFor="optionDurationField" className="text-xl font-semibold mt-5 text-white">
                    Duration for Option (In seconds)
                  </label>
                  <input
                    type="number"
                    id="optionDurationField"
                    placeholder="Duration in seconds"
                    value={optionDuration}
                    onChange={(e) => handleOptionDurationUpdate(e.target.value)}
                    className="mt-2 mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="self-center border-2 w-1/2 bg-black mt-4 p-2 rounded-full hover:bg-white hover:border-black hover:text-black font-roboto font-semibold text-2xl text-white transition-all duration-300"
                >
                  Sale
                </button>
              </div>
            </div>
          </div>
          <div className="m-5 p-10"></div>
        </div>
      </div>
    </div>
  );
}