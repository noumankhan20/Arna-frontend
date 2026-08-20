"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // ✅ add router
import { useRetryPaymentMutation } from "@/redux/slices/orderApiSlice";
import Script from "next/script";

function RetryPaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // ✅ initialize router
  const orderId = searchParams.get("orderId");

  const [error, setError] = useState(null);
  const [retryPayment] = useRetryPaymentMutation();
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const hasRetried = useRef(false);

  useEffect(() => {
    if (!orderId || !sdkLoaded || hasRetried.current) return;

    hasRetried.current = true;

    const retry = async () => {
      try {
        const data = await retryPayment(orderId).unwrap();

        if (!window.Cashfree) {
          setError("Payment SDK not available.");
          return;
        }

        const cashfree = new window.Cashfree({
          mode: "production",
        });

        cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self",
        });

      } catch (err) {
        console.error("Retry error:", err);

        const message =
          err?.data?.message ||
          err?.error ||
          "Something went wrong while retrying payment.";

        setError(message);
      }
    };

    retry();
  }, [orderId, sdkLoaded, retryPayment]);

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />

      <div className="min-h-screen flex items-center justify-center px-4">
        {error ? (
          <div className="bg-white shadow-lg border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
            
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Payment Failed
            </h2>

            <p className="text-gray-700 mb-6">{error}</p>

            {/* ✅ Go Back Button */}
            <button
              onClick={() => router.push("/profile/my-orders")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition duration-200"
            >
              Go Back to Orders
            </button>

          </div>
        ) : (
          <p className="text-gray-700">Redirecting to payment...</p>
        )}
      </div>
    </>
  );
}

export default function RetryPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-700">Loading payment details...</div>}>
      <RetryPaymentPageContent />
    </Suspense>
  );
}