"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

// New component to simulate streaming GPT-based summary text
function SummaryStep({ formData, onComplete }: { formData: any; onComplete: () => void }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build a prompt using collected information
    const prompt = `Please summarize the following details in a professional tone for a fire claim: 
Owner Type: ${formData.ownerType}, 
Damage: ${formData.propertyDamage.replace("_", " ")}, 
Injury Status: ${formData.injuredStatus}. 
Address the homeowner by their first name, ${formData.firstName}. 
Explain why understanding their claim value is critical to maximizing compensation for their loss.`;

    // Simulate streaming text (replace this with actual AI SDK stream call)
    // For example, you might use:
    // streamText(prompt, { onChunk, onComplete })
    let simulatedResponse = "";
    const chunks = [
      "Thank you, " + formData.firstName + ". ",
      "Based on your selections as a " + formData.ownerType.toLowerCase() + " with " + formData.propertyDamage.replace("_", " ").toLowerCase() + ", ",
      "it is very important to accurately assess your fire claim. ",
      "Understanding your claim value ensures you receive the maximum compensation for your loss. ",
      "Our advanced claims tool will now calculate your claim value and help you secure the best possible payout."
    ];
    let index = 0;
    const interval = setInterval(() => {
      simulatedResponse += chunks[index];
      setSummary(simulatedResponse);
      index++;
      if (index === chunks.length) {
        clearInterval(interval);
        setLoading(false);
        onComplete();
      }
    }, 500); // 500ms per chunk (adjust for desired speed)
  }, [formData, onComplete]);

  return (
    <div className="form-step font-normal">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div className="mb-4 text-center">
        {loading ? (
          <p className="text-lg">Generating summary...</p>
        ) : (
          <p className="text-lg">{summary}</p>
        )}
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={() => {}}
          className="glass-box"
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        >
          Proceed
        </button>
        <div className="mt-2">
          <button type="button" onClick={() => {}} className="text-blue-600 underline">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const stepVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function LandingPage() {
  // totalSteps: 0=Owner, 1=Damage, 2=Injury, 3=Name, 4=Summary, 5=Contact
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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

  const handleOptionClick = (field: keyof typeof formData, value: string) => {
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
    // Optionally send formData to your API endpoint here.
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradientBackground />

      {/* Render header with logo only for steps 0-2 (not during name, summary, or contact) */}
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

      {/* Bottom Section: Multi-Step Form inside Glass Container */}
      <footer className="w-full flex flex-col items-center mb-12">
        {!submitted ? (
          <div className="w-full max-w-md mx-auto glass-container">
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
                      <button type="button" onClick={prevStep} className="text-blue-600 underline">
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
                      <button type="button" onClick={prevStep} className="text-blue-600 underline">
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
                    <h2 className="text-xl font-bold mb-4">Enter your name</h2>
                    <div className="flex gap-4 mb-4">
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
                    {/* Removed the customization text */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="glass-box"
                        style={{ padding: "0.75rem", fontSize: "1rem" }}
                      >
                        Proceed
                      </button>
                      <div className="mt-2">
                        <button type="button" onClick={prevStep} className="text-blue-600 underline">
                          Back
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <SummaryStep
                    formData={formData}
                    onComplete={() => {}}
                  />
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step-6"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="form-step font-normal"
                  >
                    <h2 className="text-xl font-bold mb-4">How can we contact you?</h2>
                    <div className="space-y-4">
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
                      <button type="button" onClick={prevStep} className="text-blue-600 underline">
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