"use client";
import BrandNabvar from "../../../components/BrandNav";
import React from "react";
import { useEffect, useState } from "react";
import { consumeToken } from "../../../utils";
import {
  getOrdersArray,
  addGenStation,
  getMarketPrice,
  getSLRTokenBalance,
} from "../../../utils";
import BrandCard from "../../../components/BrandCard";
import Link from "next/link";

export default function Sponsor() {
  const [SLRBalance, setSLRBalance] = useState("Fetching ...");
  const [marketPrice, setMarketPrice] = useState("Fetching");
  const [ordersArray, setOrdersArray] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleSLRBalanceUpdate() {
    try {
      const updatedBalance = await getSLRTokenBalance();
      console.log("Fetched balance:", updatedBalance);
      setSLRBalance(updatedBalance);
    } catch (error) {
      console.error("Failed to fetch SLR token balance:", error);
    }
  }

  async function updateArray() {
    setLoading(true);
    try {
      const arr = await getOrdersArray();
      console.log("Fetched orders:", arr);
      setOrdersArray(arr);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMarketPrice() {
    try {
      const updatedPrice = await getMarketPrice();
      console.log("Fetched Market Price:", updatedPrice);
      setMarketPrice(updatedPrice);
    } catch (error) {
      console.error("Failed to fetch market price:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        handleSLRBalanceUpdate(),
        updateArray(),
        updateMarketPrice()
      ]);
    };
    
    fetchData();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Filter orders that are for sale and not fulfilled
  const availableOrders = ordersArray.filter(order => order.isSale && !order.fulfilled);

  return (
    <div className="bg-black">
      <BrandNabvar />
      <div className="w-full bg-black dark:bg-grid-white/[0.2] min-h-screen items-center justify-center">
        <h1 className="scroll-m-20 text-5xl text-white font-extrabold text-center tracking-wide lg:text-5xl mt-10">
          Sponsor
          <mark className="bg-yellow-500 ml-3 rounded-lg px-3">
            Self Sufficient users
          </mark>{" "}
          from GreenWim .
        </h1>

        <div className="border-2 border-white py-5 mt-10 mx-60 rounded">
          <div className="text-center text-white text-3xl font-extrabold tracking-wider">
            You have Burned{" "}
            <mark className="px-5 py-2 rounded-2xl bg-sky-400">
              <span className="text-black">{SLRBalance}</span>
            </mark>{" "}
            SLR Points{" "}
          </div>
        </div>

        <div className="flex flex-wrap content-center justify-center mt-10">
          {loading ? (
            <div className="text-white text-2xl">Loading available orders...</div>
          ) : availableOrders.length > 0 ? (
            availableOrders.map((order) => (
              <BrandCard key={order.orderId} array={order} />
            ))
          ) : (
            <div className="text-white text-2xl">No available orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}