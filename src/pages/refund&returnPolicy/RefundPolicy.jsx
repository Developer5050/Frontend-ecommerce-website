import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 font-ubuntu text-gray-800 mt-14">
      <h1 className="text-2xl font-bold mb-6 text-center">Refund & Return Policy</h1>

      <p className="mb-6 mt-10">
        At <strong>SHOP.CO</strong>, we value your satisfaction. If you're not completely happy with your purchase, we’re here to help with a clear and fair return and refund policy.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. Return Eligibility</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Items can be returned within <strong>7 days</strong> of delivery.</li>
        <li>Product must be unused, unworn, and in its original condition with tags and packaging intact.</li>
        <li>Returns are not accepted for items on clearance or marked “final sale”.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. Return Process</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Contact our support team via email at <strong>support@shop.co</strong> or call us at <strong>+92 345 460 5682</strong> within 7 days of delivery.</li>
        <li>Provide your order number and reason for return. Our team will review and approve the request.</li>
        <li>Ship the product to the return address we’ll provide. Customer is responsible for return shipping unless the item was faulty or incorrect.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. Refund Conditions</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Once we receive and inspect the returned product, we’ll notify you of the approval or rejection of your refund.</li>
        <li>If approved, the refund will be processed within <strong>5–7 business days</strong> to your original payment method.</li>
        <li>Shipping charges are non-refundable unless the return is due to our error.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. Exchanges</h2>
      <p className="mb-4">
        We only replace items if they are defective or damaged. If you need to exchange for the same item, contact us within 3 days of delivery.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. Contact Information</h2>
      <p>
        For any queries regarding returns or refunds, please reach out to us at: <br />
        <strong className='text-md'>Email:</strong> support@shop.co <br />
        <strong className='text-md'>Phone:</strong> +92 345 460 5682
      </p>
    </div>
  );
};

export default RefundPolicy;
