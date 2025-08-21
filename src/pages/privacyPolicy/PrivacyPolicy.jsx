import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 font-ubuntu text-gray-800 mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4 mt-10">
        Effective Date: <strong>[08/05/2025]</strong>
      </p>

      <p className="mb-4">
        At <strong>SHOP.CO</strong>, we value your privacy and are committed to
        protecting your personal information. This Privacy Policy describes how
        we collect, use, and safeguard your information when you visit our
        website <strong>(www.shop.co)</strong> and make purchases through our
        platform.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-2">We may collect the following data:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Name, email address, phone number</li>
        <li>Billing and shipping addresses</li>
        <li>Payment details (via secure third-party gateways)</li>
        <li>IP address, browser/device info, usage data</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To process and fulfill your orders</li>
        <li>To communicate order updates and offers</li>
        <li>To improve website functionality and user experience</li>
        <li>To comply with legal requirements and prevent fraud</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-2">3. Sharing of Data</h2>
      <p className="mb-4">
        We do <strong>not sell</strong> your personal data. We only share it with:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Trusted shipping and payment service providers</li>
        <li>Law enforcement when required by law</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You may have the right to access, correct, or delete your personal data.
        Contact us at <strong>privacy@shop.co</strong> to make a request.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">5. Policy Updates</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. The revised policy
        will be posted here with a new effective date.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">6. Contact Us</h2>
      <p>
        If you have any questions or concerns, feel free to contact us:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Email: <strong>privacy@shop.co</strong></li>
        <li>Phone: <strong>+92 345 460 5682</strong></li>
        <li>Address: <strong>123 Main Street, Lahore, Pakistan</strong></li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
