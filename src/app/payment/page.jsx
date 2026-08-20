"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!sessionId || !orderId) {
      router.replace("/cart");
      return;
    }

    const initiatePayment = async () => {
      try {
        const cashfree = await load({
          mode:"production",
        });

        await cashfree.checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_self", // ✅ Full page redirect
        });

      } catch (error) {
        console.error("Payment initiation failed:", error);
        router.replace(`/order-failed?orderId=${orderId}`);
      }
    };

    initiatePayment();
  }, [sessionId, orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-3">
          Redirecting to secure payment...
        </h1>
        <p className="text-sm text-gray-500">
          Please do not refresh or close this page.
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-3">
            Redirecting to secure payment...
          </h1>
          <p className="text-sm text-gray-500">
            Please do not refresh or close this page.
          </p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
