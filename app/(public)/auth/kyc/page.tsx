"use client";

import React, { useState } from "react";
import styles from "../styles/kyc.module.css";

interface KYCProps {
  role: "investor" | "partner";
  onComplete: () => void; // callback when KYC is submitted
}

export default function KYCPage({ role, onComplete }: KYCProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    idDocument: "",
    addressProof: "",
    bankName: "",
    bankAccount: "",
    riskProfile: "",
    investmentExperience: "",
    companyName: "",
    companyRegistration: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate backend API call here
    console.log("KYC Submitted:", { role, ...formData });
    onComplete();
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.heading}>KYC Verification</h1>
        <p className={styles.subheading}>
          Complete your verification to access all{" "}
          {role === "investor" ? "investment features" : "partner features"}.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Step 1: Identity */}
          {step === 1 && (
            <>
              <label className={styles.field}>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className={styles.fieldInput}
                />
              </label>

              <label className={styles.field}>
                Date of Birth
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className={styles.fieldInput}
                />
              </label>

              <label className={styles.field}>
                Identity Document
                <input
                  type="file"
                  name="idDocument"
                  onChange={handleChange}
                  accept=".jpg,.png,.pdf"
                  required
                  className={styles.fieldInput}
                />
              </label>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <>
              <label className={styles.field}>
                Address Proof
                <input
                  type="file"
                  name="addressProof"
                  onChange={handleChange}
                  accept=".jpg,.png,.pdf"
                  required
                  className={styles.fieldInput}
                />
              </label>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3: Bank Details */}
          {step === 3 && (
            <>
              <label className={styles.field}>
                Bank Name
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  required
                  className={styles.fieldInput}
                />
              </label>

              <label className={styles.field}>
                Bank Account Number
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="1234567890"
                  required
                  className={styles.fieldInput}
                />
              </label>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 4: Role-Specific */}
          {step === 4 && (
            <>
              {role === "investor" && (
                <>
                  <label className={styles.field}>
                    Risk Profile
                    <select
                      name="riskProfile"
                      value={formData.riskProfile}
                      onChange={handleChange}
                      required
                      className={styles.fieldInput}
                    >
                      <option value="">Select</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>

                  <label className={styles.field}>
                    Investment Experience
                    <input
                      type="text"
                      name="investmentExperience"
                      value={formData.investmentExperience}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      className={styles.fieldInput}
                    />
                  </label>
                </>
              )}

              {role === "partner" && (
                <>
                  <label className={styles.field}>
                    Company Name
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company Name"
                      required
                      className={styles.fieldInput}
                    />
                  </label>

                  <label className={styles.field}>
                    Company Registration Document
                    <input
                      type="file"
                      name="companyRegistration"
                      onChange={handleChange}
                      accept=".jpg,.png,.pdf"
                      required
                      className={styles.fieldInput}
                    />
                  </label>
                </>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={prevStep}
                >
                  Back
                </button>
                <button type="submit" className={styles.primary}>
                  Submit KYC
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
