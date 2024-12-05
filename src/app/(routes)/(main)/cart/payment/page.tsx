"use client";

import { useRouter } from "next/navigation";
import { getCookies } from "../../../../(cookies)/cookies";
import React, { Suspense, useEffect } from "react";
import { loadStripe, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentPageComponent from "../../../../componentsPage/paymentPage";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const productID = searchParams.get("productId") as string;

  const [clientSecret, setClientSecret] = React.useState<string>("");
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState<string>("");
  const router = useRouter();
// pobranie danych dotyczacych platnosci
  useEffect(() => {
    async function fetchPaymentIntent() {
      const request = await fetch("http://localhost:8000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      });
      const data = await request.json();
      if (data && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setDpmCheckerLink(data.dpmCheckerLink);
      }
    }

    const userObject = getCookies().user;
    if (userObject === null) router.push("/login");
    else fetchPaymentIntent();
  }, []);
// style do okienka z zakupami
  const appearance: Appearance = {
    theme: "flat",
    variables: {
      colorBackground: "#1A1C25",
      colorPrimary: "#6D28D9",
      colorDanger: "#FF5252",
      fontFamily: "Arial, sans-serif",
      spacingUnit: "6px",
      borderRadius: "6px",
    },
    rules: {
      ".Input": {
        backgroundColor: "#eeeee4",
        border: "1px solid #6D28D9",
        color: "#000000",
        borderRadius: "6px",
        padding: "10px",
      },
      ".Tab": {
        backgroundColor: "#2C2F38",
        borderRadius: "6px",
        color: "#FFFFFF",
      },
      ".Tab:hover": {
        backgroundColor: "#6D28D9",
      },
      ".Tab--selected": {
        backgroundColor: "#6D28D9",
        color: "#FFFFFF",
      },
      ".SubmitButton": {
        backgroundColor: "#6D28D9",
        color: "#FFFFFF",
        fontWeight: "bold",
        borderRadius: "6px",
        padding: "12px 16px",
      },
      ".SubmitButton:hover": {
        backgroundColor: "#5A21B1",
      },
    },
  };
// bład w razie niepoprawnego klucza
  if (!clientSecret) {
    return (
      <div className="h-screen w-full overflow-hidden bg-gray-800">
        <h1 className="text-white text-2xl text-center">Loading...</h1>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret,
        appearance,
      }}
    >
      <PaymentPageComponent dpmCheckerLink={dpmCheckerLink} courseID={productID} />
    </Elements>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full overflow-hidden bg-gray-800">
          <h1 className="text-white text-2xl text-center">Loading...</h1>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
