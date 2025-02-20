"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

/** Define the form data interface */
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

/** Variants for the fade in/out steps */
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

  /** Go to next step, but do not exceed totalSteps - 1 */
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  /** Go to previous step, but not below 0 */
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  /** Handle option-button clicks (ownerType, propertyDamage, etc.) */
  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  /** Handle text inputs and checkbox */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /** On final submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    // TODO: Send formData to your API endpoint if desired.
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      {/* Animated Gradient in the background */}
      <AnimatedGradientBackground />

      {/* Top Section: Ad + Logo (no logo on final step, as requested) */}
      {/* 
          If you want to remove the logo only on the final step, 
          you can conditionally render it: 
          {!submitted && currentStep < 3 && (...logo...)} 
          or similar logic 
      */}
      <header className="flex flex-col items-center pt-2 sm:pt-4">
        <p className="attorney-ad">Legal Advertisement</p>
        {/* If you do NOT want the logo on the final step, uncomment the condition below: 
            {currentStep < 3 && !submitted && (
               <div className="mt-2 mb-4">
                 <Image ... />
               </div>
            )} 
        */}
        <div className="mt-2 mb-4">
          <Image
            src={Logo}
            alt="Logo"
            width={90}
            height={90}
            className="pulse-logo"
          />
        </div>
      </header>

      {/* Middle Section: Headline */}
      <section className="flex flex-col items-center flex-grow justify-center px-4 sm:px-12 text-center">
        <AnimatedHeadline />
      </section>

      {/* Bottom Section: Multi-Step Form */}
      <footer className="w-full flex flex-col items-center pb-6">
        {!submitted ? (
          <div className="w-full max-w-sm mx-auto px-4 sm:px-0">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-right text-xs sm:text-sm text-gray-300 mt-1">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>

            <form onSubmit={handleSubmit} id="multistep-form">
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
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
                    <h2 className="text-lg sm:text-xl font-bold mb-3">
                      What best describes you?
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
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
                        onClick={() =>
                          handleOptionClick("ownerType", "Business Owner")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">💼</span>Business
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("ownerType", "Multifamily Owner")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏘️</span>Multifamily
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
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
                    <h2 className="text-lg sm:text-xl font-bold mb-3">
                      What kind of damage?
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("propertyDamage", "property_destroyed")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🔥</span>Lost Home
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("propertyDamage", "partial_damaged")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🏚️</span>Partial
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("propertyDamage", "smoke_damage")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">💨</span>Smoke
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("propertyDamage", "evac_only")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🚨</span>Evac Only
                      </button>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-blue-300 underline text-sm"
                      >
                        Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
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
                    <h2 className="text-lg sm:text-xl font-bold mb-3">
                      Were you injured?
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("injuredStatus", "injured")
                        }
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        <span className="mr-2">🤕</span>Yes
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionClick("injuredStatus", "not_injured")
                        }
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
                        className="text-blue-300 underline text-sm"
                      >
                        Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 */}
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
                    <h2 className="text-lg sm:text-xl font-bold mb-3">
                      How can we contact you?
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          required
                          className="w-full sm:w-1/2 p-2 border rounded text-black"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          required
                          className="w-full sm:w-1/2 p-2 border rounded text-black"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          className="w-full sm:w-1/2 p-2 border rounded text-black"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          required
                          className="w-full sm:w-1/2 p-2 border rounded text-black"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* TCPA Section */}
                      <div className="bg-white bg-opacity-90 text-black p-3 rounded">
                        <label className="flex items-start gap-2 cursor-pointer text-sm leading-snug">
                          <input
                            type="checkbox"
                            id="tcpa"
                            name="tcpaConsent"
                            checked={formData.tcpaConsent}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <span>
                            By checking this box, I give permission for MTI Firm
                            to contact me via call, email, or text to better
                            service my claim. We do not use autodialers or spam
                            messaging. I understand that my consent is not a
                            requirement or condition of any purchase, and I can
                            opt out at any time by replying STOP.
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-blue-300 underline text-sm"
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
          <div className="text-center px-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-100">
              A wildfire claims consultant will contact you shortly.
            </p>
          </div>
        )}
      </footer>
    </main>
  );
}