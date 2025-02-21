"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

// Global pulse keyframes (optional – if not defined in your CSS)
const globalStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
`;

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

/**
 * SummaryStep simulates an AI-generated summary with dramatic streaming.
 * The "Proceed" button appears 4 seconds after streaming completes.
 */
function SummaryStep({
  formData,
  onComplete,
  onBack,
}: {
  formData: FormData;
  onComplete: () => void;
  onBack: () => void;
}) {
  const firstNameVal = formData.firstName ? formData.firstName.trim() : "User";
  const ownerTypeVal = formData.ownerType || "unspecified";
  const propertyDamageVal = formData.propertyDamage
    ? formData.propertyDamage.replace("_", " ")
    : "unspecified";
  const injuredStatusVal =
    formData.injuredStatus === "injured" ? " and injuries" : "";

  // Build the prompt from parts to avoid stray "undefined".
  const promptParts = [
    "Great job",
    firstNameVal,
    "for taking the first step.",
    "Our advanced AI has begun evaluating your fire claim based on your status as a",
    ownerTypeVal,
    "facing significant",
    propertyDamageVal,
    injuredStatusVal,
    ". To deliver an instant, precise estimate tailored to your situation, we simply need a few more details.",
    "Please share your contact information so we can complete your evaluation and help you secure the maximum compensation available.",
    "Thank you,",
    firstNameVal + "!"
  ];
  let prompt = promptParts.filter(part => part.trim() !== "").join(" ");
  prompt = prompt.replace(/undefined/g, "").replace(/\s+/g, " ").trim();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProceed, setShowProceed] = useState(false);

  useEffect(() => {
    const words = prompt.split(" ").filter((w) => w);
    let index = 0;
    setSummary("");
    setLoading(true);
    const interval = setInterval(() => {
      if (index < words.length) {
        setSummary(prev => (prev ? prev + " " + words[index] : words[index]));
        index++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 119);
    return () => clearInterval(interval);
  }, [prompt]);

  // Delay showing the Proceed button by 4 seconds after streaming completes.
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowProceed(true), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowProceed(false);
    }
  }, [loading]);

  const renderFinalSummary = () => {
    const cleanSummary = summary.replace(/undefined/g, "").trim();
    return (
      <p className="text-lg mb-2">
        {cleanSummary.split(" ").map((word, i) => (
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
      <div className="mb-4 px-4 w-full max-w-5xl mx-auto summary-container text-left flex flex-col justify-center">
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
        {showProceed ? (
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3 text-lg font-medium sm:min-w-[400px]"
            style={{
              background: "rgba(229, 57, 53, 0.65)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(2.5px)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.18)"
            }}
          >
            Proceed
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 text-lg font-medium opacity-50 cursor-not-allowed sm:min-w-[400px]"
            style={{
              background: "rgba(229, 57, 53, 0.65)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(2.5px)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.18)"
            }}
          >
            Please wait...
          </button>
        )}
        <div className="mt-2">
          <button type="button" onClick={onBack} className="text-blue-400 underline">
            Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * NameStep collects the user's first and last name.
 * On desktop, the inputs appear side by side; on mobile they stack.
 */
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
    setFormData(prev => ({ ...prev, ...data }));
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
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full p-3 border rounded text-black text-base"
        />
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full p-3 border rounded text-black text-base"
        />
      </div>
      {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName.message}</p>}
      {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName.message}</p>}
      <div className="mt-6 flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleSubmit(onNameSubmit)}
          className="w-full py-3 text-lg font-medium"
          style={{
            background: "rgba(229, 57, 53, 0.65)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(2.5px)",
            WebkitBackdropFilter: "blur(2.5px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.18)"
          }}
        >
          Proceed
        </button>
        <button type="button" onClick={prevStep} className="text-blue-400 underline">
          Back
        </button>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  // Steps: 0 = Owner selection, 1 = Damage type, 2 = Injury status, 3 = Enter Name, 4 = Summary, 5 = Contact Info.
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

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    nextStep();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === "phone") {
      newValue = formatPhoneNumber(value);
    }
    setFormData(prev => ({
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
    <>
      <style jsx global>{globalStyles}</style>
      <main className="h-screen flex flex-col bg-transparent overflow-hidden">
        <AnimatedGradientBackground />

        {/* Header: Legal Advertisement at top, then logo (if step < 4), then headline */}
        <header className="w-full px-4 sm:px-6 flex flex-col items-center">
          <p className="attorney-ad">Legal Advertisement</p>
          <div className="flex justify-center w-full">
            {!submitted && currentStep < 4 && (
              <Image src={Logo} alt="Logo" width={100} height={100} className="pulse-logo" />
            )}
          </div>
          <AnimatedHeadline />
        </header>

        {/* Multi-Step Form Section */}
        <footer className="w-full flex flex-col items-center mb-12 px-4">
          {!submitted ? (
            <div
              className="w-full max-w-2xl mx-auto p-4 sm:p-6"
              style={{
                background: "rgba(65, 112, 142, 0.45)",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                backdropFilter: "blur(5.5px)",
                WebkitBackdropFilter: "blur(5.5px)",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.18)"
              }}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-300 rounded-full">
                  <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
                </div>
                <p className="text-right text-sm text-gray-200 mt-1">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
              <form onSubmit={handleSubmit} id="multistep-form">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                      <h2 className="text-xl font-medium mb-4">What best describes you?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleOptionClick("ownerType", "Homeowner")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🏠</span>Homeowner
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("ownerType", "Renter")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🏢</span>Renter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("ownerType", "Business Owner")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">💼</span>Business Owner
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("ownerType", "Multifamily Owner")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🏘️</span>Multifamily
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 1 && (
                    <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                      <h2 className="text-xl font-medium mb-4">What kind of damage?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleOptionClick("propertyDamage", "property_destroyed")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🔥</span>Lost Home
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("propertyDamage", "partial_damaged")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🏚️</span>Partial Damage
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("propertyDamage", "smoke_damage")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">💨</span>Smoke Damage
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("propertyDamage", "evac_only")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🚨</span>Evacuation Only
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div key="step-3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="form-step">
                      <h2 className="text-xl font-medium mb-4">Were you injured?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleOptionClick("injuredStatus", "injured")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🤕</span>Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOptionClick("injuredStatus", "not_injured")}
                          className="w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)"
                          }}
                        >
                          <span className="mr-2">🙅‍♂️</span>No
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <button type="button" onClick={prevStep} className="text-blue-400 underline">
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
                        lastName: formData.lastName.trim()
                      }}
                      onComplete={nextStep}
                      onBack={prevStep}
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
                      <h2 className="text-xl font-medium mb-4">Continue your claim</h2>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            className="w-full sm:w-1/2 p-3 border rounded text-black text-base"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="(XXX) XXX-XXXX"
                            required
                            className="w-full sm:w-1/2 p-3 border rounded text-black text-base"
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
                            className="h-8 w-8"
                          />
                          <label htmlFor="tcpa" className="ml-3 text-xs text-gray-400">
                            By checking this box, I give permission for MTI Firm to contact me via call, email, or text to better service my claim. We do not use autodialers or spam messaging. I understand that my consent is not a requirement or condition of any purchase, and I can opt out at any time by replying STOP.
                          </label>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col">
                        <button
                          type="submit"
                          className="py-3 text-lg font-medium w-full sm:min-w-[400px]"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                            padding: "1rem",
                          }}
                        >
                          Submit
                        </button>
                        <button type="button" onClick={prevStep} className="mt-2 text-blue-400 underline">
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          ) : (
            <div className="text-center px-4">
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-gray-700">
                A wildfire claims consultant will contact you shortly.
              </p>
            </div>
          )}
        </footer>
      </main>
    </>
  );
}