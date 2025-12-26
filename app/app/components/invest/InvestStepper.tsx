"use client";

import { useState } from "react";
import InvestAmount from "./InvestAmount";
import InvestPreview from "./InvestPreview";
import InvestConfirm from "./InvestConfirm";
export default function InvestStepper() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);

  return (
    <>
      {step === 1 && (
        <InvestAmount
          amount={amount}
          onNext={(value) => {
            setAmount(value);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <InvestPreview
          amount={amount}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <InvestConfirm amount={amount} onBack={() => setStep(2)} />
      )}
    </>
  );
}
