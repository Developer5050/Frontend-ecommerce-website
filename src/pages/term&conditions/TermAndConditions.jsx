import React from "react";

const TermAndConditions = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 font-ubuntu text-gray-800 mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Terms & Conditions</h1>
      <p className="mb-4 mt-10">
        Welcome to <strong>SHOP.CO</strong>. These Terms and Conditions govern
        your access to and use of our website (<strong>www.shop.co</strong>)
        and services. By using our site, you accept these terms in full.
        If you disagree with any part, please do not use our services.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">1. Website Use</h2>
      <p className="mb-4">
        You agree to use SHOP.CO only for lawful purposes. You must not use
        this site in any way that may cause damage, interruption, or impairment
        to the website or access to it.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">2. User Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must provide accurate personal information when placing orders.</li>
        <li>You are responsible for maintaining the confidentiality of your account.</li>
        <li>You must not use another person's account without their permission.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-2">3. Intellectual Property</h2>
      <p className="mb-4">
        All content on SHOP.CO — including logos, images, product descriptions,
        and designs — is the intellectual property of SHOP.CO or its licensors.
        You may not reproduce, distribute, or use any content without our written consent.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">4. Order Acceptance & Pricing</h2>
      <p className="mb-4">
        We reserve the right to cancel or refuse any order. In case of pricing errors,
        we will notify you before processing the order. All prices are subject to change without notice.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">5. Contact Us</h2>
      <p className="mb-2">If you have questions regarding these Terms, contact us at:</p>
      <ul className="list-disc ml-6">
        <li>Email: <strong>support@shop.co</strong></li>
        <li>Phone: <strong>+92 345 460 5682</strong></li>
        <li>Address: <strong>123 Main Street, Lahore, Pakistan</strong></li>
      </ul>
    </div>
  );
};

export default TermAndConditions;
