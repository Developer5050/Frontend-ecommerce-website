import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 font-ubuntu text-gray-800 mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Shipping Policy</h1>

      <p className="mb-6 mt-10">
        At <strong>SHOP.CO</strong>, we aim to ensure a smooth and timely delivery experience for our customers.
        Please review the following shipping details before placing your order.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. Delivery Options</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong className='text-md'>Local Delivery:</strong> Available across Pakistan. We deliver to all major cities and remote areas via trusted courier partners.</li>
        <li><strong className='text-md'>International Delivery:</strong> We ship to selected international destinations. Shipping times and charges may vary based on country and location.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. Estimated Delivery Time</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong className='text-md'>Local Orders:</strong> 2–5 business days (depending on your location).</li>
        <li><strong className='text-md'>International Orders:</strong> 7–14 business days (subject to customs clearance and courier transit time).</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. Shipping Charges</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong className='text-md'>Local Shipping:</strong> Flat rate of PKR 200. Free shipping on orders above PKR 3,000.</li>
        <li><strong className='text-md'>International Shipping:</strong> Charges calculated at checkout based on destination and weight.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. Handling Time</h2>
      <p className="mb-4">
        Orders are processed and dispatched within 1–2 business days. Orders placed on weekends or public holidays will be processed the next working day.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. Delays & Exceptions</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Delays may occur due to weather conditions, courier issues, or customs clearance.</li>
        <li>We are not responsible for shipping delays once the package has left our warehouse.</li>
        <li>Incorrect addresses or incomplete information may cause further delays.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p>
        For shipping-related questions or order tracking, please contact our support team at: <br />
        <strong className='text-md'>Email:</strong> support@shop.co <br />
        <strong className='text-md'>Phone:</strong> +92 345 460 5682
      </p>
    </div>
  );
};

export default ShippingPolicy;
