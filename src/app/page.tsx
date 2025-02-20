"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

interface FormData {
  ownerType: string;
  propertyDamage: string;
  injuredStatus: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcpaConsent: boolean;
}

const stepVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function LandingPage() {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    ownerType: "",
    propertyDamage: "",
    injuredStatus: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tcpaConsent: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    // Optionally, send formData to your API endpoint here.
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradientBackground />

      {/* Conditionally render header with logo only if not on the final step */}
      {currentStep < 3 && (
        <header className="flex flex-col items-center">
          <p className="attorney-ad">Legal Advertisement</p>
          <div className="animate-fade-down mt-2 mb-4">
            <Image src={Logo} alt="Logo" width={100} height={100} className="pulse-logo" />
          </div>
        </header>
      )}

      {/* Middle Section: Animated Headline */}
      <section className="flex flex-col items-center flex-grow justify-center px-6 sm:px-12 text-center">
        <AnimatedHeadline />
      </section>

      {/* Bottom Section: Multi-Step Form */}
      <footer className="w-full flex flex-col items-center mb-12">
        {!submitted ? (
          // Added the glass-container class here for glass morphism effect on the form.
          <div className="glass-container w-full max-w-md mx-auto">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-600">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>

            <form onSubmit={handleSubmit} id="multistep-form">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="form-step"
                  >
                    <h2 className="text-xl font-bold mb-4">What best describes you?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleOptionClick("ownerType", "Homeowner")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏠</span>Homeowner
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("ownerType", "Renter")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏢</span>Renter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("ownerType", "Business Owner")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">💼</span>Business Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("ownerType", "Multifamily Owner")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏘️</span>Multifamily Owner
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="form-step"
                  >
                    <h2 className="text-xl font-bold mb-4">What kind of damage?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleOptionClick("propertyDamage", "property_destroyed")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🔥</span>Lost Home
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("propertyDamage", "partial_damaged")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏚️</span>Partial Damage
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("propertyDamage", "smoke_damage")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">💨</span>Smoke Damage
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("propertyDamage", "evac_only")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🚨</span>Evacuation Only
                      </button>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-blue-600 underline"
                      >
                        Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="form-step"
                  >
                    <h2 className="text-xl font-bold mb-4">Were you injured?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleOptionClick("injuredStatus", "injured")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🤕</span>Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptionClick("injuredStatus", "not_injured")}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🙅‍♂️</span>No
                      </button>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-blue-600 underline"
                      >
                        Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-4"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="form-step"
                  >
                    <h2 className="text-xl font-bold mb-4">How can we contact you?</h2>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          required
                          className="w-1/2 p-2 border rounded"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          required
                          className="w-1/2 p-2 border rounded"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          className="w-1/2 p-2 border rounded"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          required
                          className="w-1/2 p-2 border rounded"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tcpa"
                          name="tcpaConsent"
                          checked={formData.tcpaConsent}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="tcpa" className="text-sm" style={{ color: "#b8b8b8" }}>
                          By checking this box, I give permission for MTI Firm to contact me via call, email, or text to better service my claim. We do not use autodialers or spam messaging. I understand that my consent is not a requirement or condition of any purchase, and I can opt out at any time by replying STOP.
                        </label>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-blue-600 underline"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="glass-box"
                        style={{
                          background: "#28a745",
                          boxShadow: "0 0 10px 2px #28a745",
                          padding: "0.75rem",
                          fontSize: "1rem",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-700">
              A wildfire claims consultant will contact you shortly.
            </p>
          </div>
        )}
      </footer>
    </main>
  );
}