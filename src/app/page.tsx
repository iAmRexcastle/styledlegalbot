"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

// Define our form data interface.
export interface FormData {
  ownerType: string;
  propertyDamage: string;
  injuredStatus: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcpaConsent: boolean;
  summary?: string;
}

// Animation variants for step transitions.
const stepVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6 },
  },
};

// Zod schema for validating the name fields.
const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
type NameFormData = z.infer<typeof nameSchema>;

/**
 * Helper function to format a phone number as (XXX) XXX-XXXX.
 */
function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").substring(0, 10);
  const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    let formatted = "";
    if (match[1]) {
      formatted = `(${match[1]}`;
      if (match[1].length === 3) {
        formatted += ") ";
      }
    }
    if (match[2]) {
      formatted += match[2];
      if (match[2].length === 3 && match[3]) {
        formatted += "-";
      }
    }
    if (match[3]) {
      formatted += match[3];
    }
    return formatted;
  }
  return value;
}

// SummaryStep simulates an AI-generated summary with dramatic streaming.
function SummaryStep({
  formData,
  onComplete,
  onBack,
}: {
  formData: FormData;
  onComplete: () => void;
  onBack: () => void;
}) {
  useEffect(() => {
    console.log("SummaryStep received firstName:", formData.firstName);
  }, [formData.firstName]);

  // Use fallbacks for undefined values.
  const firstName = formData.firstName?.trim() || "there";
  const ownerType = formData.ownerType || "unspecified";
  const propertyDamage = formData.propertyDamage
    ? formData.propertyDamage.replace("_", " ")
    : "unspecified";
  const injuredStatus = formData.injuredStatus || "unspecified";

  // Updated prompt using firstName twice.
  const prompt = `Great job ${firstName} for taking the first step. Our advanced AI has begun evaluating your fire claim based on your status as a ${ownerType} facing significant ${propertyDamage}${
    injuredStatus === "injured" ? " and injuries" : ""
  }. To deliver an instant, precise estimate tailored to your situation, we simply need a few more details. Please share your contact information so we can complete your evaluation and help you secure the maximum compensation available. Thank you, ${firstName}!`;

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  // Streaming effect: display the prompt word-by-word with a 119ms delay.
  useEffect(() => {
    console.log("SummaryStep prompt:", prompt);
    const words = prompt.trim().split(" ").filter((word) => word && word !== "undefined");
    let index = 0;
    setSummary(""); // reset
    setLoading(true);
    const interval = setInterval(() => {
      setSummary((prev) => prev + (prev ? " " : "") + words[index]);
      index++;
      if (index >= words.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 119); // 119ms per word (~15% faster than 140ms)
    return () => clearInterval(interval);
  }, [prompt]);

  // Once streaming is complete, render the final summary with dramatic fade-in per word.
  const renderFinalSummary = () => {
    return (
      <p className="text-lg mb-2">
        {summary.split(" ").map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </p>
    );
  };

  return (
    <motion.div
      key="step-summary"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="form-step font-normal"
    >
      {/* Use custom summary-container for full visibility */}
      <div className="mb-4 px-4 w-full max-w-4xl mx-auto summary-container text-left flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4 mt-8">
            <div className="w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            <span className="text-xl text-gray-600">Generating your claim estimate...</span>
          </div>
        ) : (
          renderFinalSummary()
        )}
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={onComplete}
          className="glass-box"
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            fontWeight: "400",
            background: "rgba(155,155,155,0.2)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.6)",
            color: "#fff",
          }}
        >
          Proceed
        </button>
        <div className="mt-2">
          <button type="button" onClick={onBack} className="text-blue-600 underline">
            Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// NameStep component using react-hook-form.
function NameStep({
  setFormData,
  nextStep,
  prevStep,
}: {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  const onNameSubmit = (data: NameFormData) => {
    console.log("NameStep data:", data);
    setFormData((prev) => ({ ...prev, ...data }));
    nextStep();
  };

  return (
    <motion.div
      key="step-4"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="form-step"
    >
      <h2 className="text-xl font-medium mb-4">Enter your name</h2>
      <div className="flex flex-col items-center">
        <div className="flex gap-4 mb-4">
          <input {...register("firstName")} placeholder="First Name" className="w-1/2 p-2 border rounded" />
          <input {...register("lastName")} placeholder="Last Name" className="w-1/2 p-2 border rounded" />
        </div>
        {errors.firstName && <p className="text-red-500 text-sm mb-2">{errors.firstName.message}</p>}
        {errors.lastName && <p className="text-red-500 text-sm mb-2">{errors.lastName.message}</p>}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSubmit(onNameSubmit)}
            className="glass-box"
            style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}
          >
            Proceed
          </button>
          <div className="mt-2">
            <button type="button" onClick={prevStep} className="text-blue-600 underline">
              Back
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  // Define steps and state variables.
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState<number>(0);
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
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Log the current formData for debugging.
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  // Update phone input formatting and enforce max 10 digits.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === "phone") {
      newValue = formatPhoneNumber(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const res = await fetch("/api/leads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("Error submitting lead");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    }
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      <AnimatedGradientBackground />

      {currentStep < 3 && (
        <header className="flex flex-col items-center">
          <p className="attorney-ad">Legal Advertisement</p>
          <div className="animate-fade-down mt-2 mb-4">
            <Image src={Logo} alt="Logo" width={100} height={100} className="pulse-logo" />
          </div>
        </header>
      )}

      <section className="flex flex-col items-center flex-grow justify-center px-6 sm:px-12 text-center">
        <AnimatedHeadline />
      </section>

      <footer className="w-full flex flex-col items-center mb-12">
        {!submitted ? (
          <div className="w-full max-w-md mx-auto glass-container">
            <div className="mb-4">
              <div className="h-2 bg-gray-300 rounded-full">
                <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
              </div>
              <p className="text-right text-sm text-gray-600">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <form onSubmit={handleSubmit} id="multistep-form">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                    <h2 className="text-xl font-medium mb-4">What best describes you?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => handleOptionClick("ownerType", "Homeowner")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🏠</span>Homeowner
                      </button>
                      <button type="button" onClick={() => handleOptionClick("ownerType", "Renter")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🏢</span>Renter
                      </button>
                      <button type="button" onClick={() => handleOptionClick("ownerType", "Business Owner")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">💼</span>Business Owner
                      </button>
                      <button type="button" onClick={() => handleOptionClick("ownerType", "Multifamily Owner")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🏘️</span>Multifamily
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                    <h2 className="text-xl font-medium mb-4">What kind of damage?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => handleOptionClick("propertyDamage", "property_destroyed")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🔥</span>Lost Home
                      </button>
                      <button type="button" onClick={() => handleOptionClick("propertyDamage", "partial_damaged")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🏚️</span>Partial Damage
                      </button>
                      <button type="button" onClick={() => handleOptionClick("propertyDamage", "smoke_damage")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">💨</span>Smoke Damage
                      </button>
                      <button type="button" onClick={() => handleOptionClick("propertyDamage", "evac_only")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🚨</span>Evacuation Only
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step-3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                    <h2 className="text-xl font-medium mb-4">Were you injured?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => handleOptionClick("injuredStatus", "injured")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
                        <span className="mr-2">🤕</span>Yes
                      </button>
                      <button type="button" onClick={() => handleOptionClick("injuredStatus", "not_injured")} className="glass-box" style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "400" }}>
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
                  <NameStep setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
                )}

                {currentStep === 4 && (
                  <SummaryStep
                    formData={{
                      ...formData,
                      firstName: formData.firstName.trim(),
                      lastName: formData.lastName.trim(),
                    }}
                    onComplete={nextStep}
                    onBack={prevStep}
                  />
                )}

                {currentStep === 5 && (
                  <motion.div key="step-6" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step font-normal">
                    <h2 className="text-xl font-medium mb-4">Continue your claim</h2>
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
                          placeholder="(XXX) XXX-XXXX"
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
                        <label htmlFor="tcpa" className="text-sm text-gray-400">
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
                          fontWeight: "400",
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