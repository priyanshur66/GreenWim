import { consumeToken, buyOption } from "../utils";
import { formatUnits } from "ethers";

const BrandCard = ({ array }) => {
  // Handle order being either an array or object format
  const isArrayFormat = Array.isArray(array) || !array.seller;
  
  // Format ETH values to 4 decimal places
  const formatEthValue = (value) => {
    return typeof value === 'number' ? value.toFixed(4) : '0.0000';
  };
  
  // Get seller based on format
  const seller = isArrayFormat ? array[0] : array.seller;
  
  // Get orderId based on format
  const orderId = isArrayFormat ? Number(array[2]) : array.orderId;
  
  // Get formatted sell price based on format
  const formattedSellPrice = isArrayFormat 
    ? (array[3] && typeof array[3].toString === 'function' 
        ? Number(formatUnits(array[3].toString(), 'ether'))
        : 0)
    : array.formattedSellPrice;
  
  // Get SLR tokens based on format
  const slrTokens = isArrayFormat ? Number(array[10]) : array.noOfSLRTokens;
  
  // Get option duration based on format
  const optionDuration = isArrayFormat ? Number(array[8]) : array.optionDuration;
  
  // Get formatted option fee based on format
  const formattedOptionFee = isArrayFormat 
    ? (array[7] && typeof array[7].toString === 'function'
        ? Number(formatUnits(array[7].toString(), 'ether'))
        : 0)
    : array.formattedOptionFee;
  
  // Handle consume token with proper ETH value
  const handleConsumeToken = () => {
    try {
      consumeToken(orderId, formattedSellPrice);
    } catch (error) {
      console.error("Error calling consumeToken:", error);
    }
  };
  
  // Handle buy option with proper ETH value
  const handleBuyOption = () => {
    try {
      buyOption(orderId, formattedOptionFee);
    } catch (error) {
      console.error("Error calling buyOption:", error);
    }
  };
  
  return (
    <div className="w-80 m-4 border-2 border-gray-800 rounded-xl shadow bg-gray-100 backdrop-blur-lg overflow-hidden">
      <div className="p-5">
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Seller</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 truncate text-sm text-black bg-white">
            {seller}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Price</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-green-600 bg-white">
            {formatEthValue(formattedSellPrice)} ETH
          </div>
        </div>
        
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">SLR Tokens</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-blue-600 bg-white">
            {slrTokens}
          </div>
        </div>

        {optionDuration > 0 && (
          <>
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Duration</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl text-black bg-white">
                {optionDuration} days
              </div>
            </div>
            
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Price</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl font-bold text-purple-600 bg-white">
                {formatEthValue(formattedOptionFee)} ETH
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleConsumeToken}
            className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-md px-5 py-2.5 text-center"
          >
            Consume
          </button>

          {optionDuration > 0 && (
            <button
              onClick={handleBuyOption}
              className="text-white bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-md px-5 py-2.5 text-center"
            >
              Buy Option
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCard;