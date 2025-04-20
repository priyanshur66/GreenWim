import { consumeToken, buyOption, formatEther } from "../utils";

const BrandCard = ({ array }) => {
  // Format ETH values to 4 decimal places
  const formatEthValue = (value) => {
    return typeof value === 'number' ? value.toFixed(4) : '0.0000';
  };
  
  // Calculate formatted prices
  const sellPrice = Number(array[3] / BigInt("1000000000000000")) / 1000;
  const optionPrice = Number(array[7] / BigInt("1000000000000000")) / 1000;
  
  // Handle consume token with proper ETH value
  const handleConsumeToken = () => {
    consumeToken(Number(array[2]), sellPrice);
  };
  
  // Handle buy option with proper ETH value
  const handleBuyOption = () => {
    buyOption(Number(array[2]), optionPrice);
  };
  
  return (
    <div className="w-80 m-4 border-2 border-gray-800 rounded-xl shadow bg-gray-100 backdrop-blur-lg overflow-hidden">
      <div className="p-5">
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Seller</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 truncate text-sm text-black bg-white">
            {array[0]}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Price</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-green-600 bg-white">
            {formatEthValue(sellPrice)} ETH
          </div>
        </div>
        
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">SLR Tokens</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-blue-600 bg-white">
            {Number(array[10])}
          </div>
        </div>

        {Number(array[8]) > 0 && (
          <>
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Duration</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl text-black bg-white">
                {Number(array[8])} days
              </div>
            </div>
            
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Price</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl font-bold text-purple-600 bg-white">
                {formatEthValue(optionPrice)} ETH
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

          {Number(array[8]) > 0 && (
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