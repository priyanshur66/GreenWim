import { buyOrder, buyOption } from "../utils";

const Card = ({ array: order }) => {
  console.log("Order fulfilled status:", order.fulfilled);
  
  // Format ETH values to 4 decimal places
  const formatEthValue = (value) => {
    return typeof value === 'number' ? value.toFixed(4) : '0.0000';
  };
  
  // Handle buy order with proper ETH value
  const handleBuyOrder = () => {
    // Use the formatted value which is in ETH
    buyOrder(order.orderId, order.formattedSellPrice);
  };
  
  // Handle buy option with proper ETH value
  const handleBuyOption = () => {
    // Use the formatted value which is in ETH
    buyOption(order.orderId, order.formattedOptionFee);
  };
  
  return (
    <div className="w-80 m-4 border-2 border-gray-800 rounded-xl shadow bg-gray-100 backdrop-blur-lg overflow-hidden">
      <div className="p-5">
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Seller</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 truncate text-sm text-black bg-white">
            {order.seller}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">Price</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-green-600 bg-white">
            {formatEthValue(order.formattedSellPrice)} ETH
          </div>
        </div>
        
        <div className="mb-4">
          <span className="font-semibold text-xl block mb-1 text-black">SLR Tokens</span>
          <div className="border-2 border-gray-300 rounded-lg p-2 text-2xl font-bold text-blue-600 bg-white">
            {order.noOfSLRTokens}
          </div>
        </div>

        {order.optionDuration > 0 && (
          <>
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Duration</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl text-black bg-white">
                {order.optionDuration} days
              </div>
            </div>
            
            <div className="mb-4">
              <span className="font-semibold text-xl block mb-1 text-black">Option Price</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 text-xl font-bold text-purple-600 bg-white">
                {formatEthValue(order.formattedOptionFee)} ETH
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBuyOrder}
            className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-md px-5 py-2.5 text-center"
          >
            Buy Now
          </button>

          {order.optionDuration > 0 && (
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

export default Card;