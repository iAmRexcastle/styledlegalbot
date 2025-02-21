"use client";

<<<<<<< HEAD
import { useState } from "react";
import Image from "next/image";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

export default function LandingPage() {
  const [animateClass, setAnimateClass] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleBoxClick = (option: string) => {
    setAnimateClass("animate-fade-out");
    setTimeout(() => {
      setSelectedOption(option);
      console.log("Selected option:", option);
      setAnimateClass("animate-fade-in");
    }, 1000);
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      {/* Full-Page Animated Gradient Background */}
      <AnimatedGradientBackground />

      {/* Top Section: Attorney Advertisement & Logo */}
      <header className="flex flex-col items-center">
        <p className="attorney-ad">Legal Advertisement</p>
        <div className="animate-fade-down mt-2 mb-4">
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={100}
            className="pulse-logo"
          />
        </div>
      </header>

      {/* Middle Section: Animated Headline & Subhead with mobile padding */}
      <section className="flex flex-col items-center flex-grow justify-center px-6 sm:px-12 text-center">
        <AnimatedHeadline />
      </section>

      {/* Bottom Section: Quiz Question & Option Buttons */}
      <footer className="w-full flex flex-col items-center mb-12">
        <p
          className="quiz-question animate-fade-down mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          Injured In Eaton Fires?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => handleBoxClick("Yes")}
            className={`glass-box ${animateClass}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            <span className="mr-2">🤕</span>Yes
          </button>
          <button
            onClick={() => handleBoxClick("No")}
            className={`glass-box ${animateClass}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            <span className="mr-2">🙅</span>No
          </button>
        </div>
        <div className="mt-16"></div>
      </footer>
    </main>
=======
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/app/Logo.svg";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

/* 
  Global CSS overrides and animations.
  Make sure Montserrat & Poppins are actually loaded 
  (e.g., via a <link> to Google Fonts or @import).
*/
const globalStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  @keyframes headline-gradient-cycle {
    0% { --color-1: #7ec8e3; --color-2: #a1c4fd; }
    25% { --color-1: #a1c4fd; --color-2: #7ec8e3; }
    50% { --color-1: #7ec8e3; --color-2: #a1c4fd; }
    75% { --color-1: #a1c4fd; --color-2: #7ec8e3; }
    100% { --color-1: #7ec8e3; --color-2: #a1c4fd; }
  }
  .animated-gradient-headline {
    background: linear-gradient(to right, var(--color-1), var(--color-2));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: headline-gradient-cycle 10s linear infinite;
    -webkit-text-stroke: 0.5px rgba(0,0,0,0.4);
    text-stroke: 0.5px rgba(0,0,0,0.4);
  }
`;

/**
 * Modal component for displaying legal text (TOS & Privacy).
 */
function Modal({
  isOpen,
  onClose,
  title,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white text-black rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 overflow-y-auto max-h-[80vh]"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="text-sm whitespace-pre-line leading-relaxed">
              {content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Sample TOS & Privacy text
const TERMS_OF_SERVICE = `
MTI FIRM Terms of Service
( ... )
`;
const PRIVACY_POLICY = `
MTI FIRM Privacy Policy
( ... )
`;

/**
 * AnimatedHeadline 
 * - H1 uses Montserrat 800 
 * - Subhead (H2) uses Montserrat 700
 */
function AnimatedHeadline() {
  return (
    <div className="animate-fade-down my-4 text-center">
      <h1 className="animated-gradient-headline text-2xl sm:text-3xl font-[Montserrat] font-extrabold leading-tight">
        Your AI Claims Assistant
      </h1>
      <h2 className="text-white font-[Montserrat] font-bold text-base sm:text-lg mt-2">
        Maximize your compensation with our advanced claims tool.
      </h2>
    </div>
  );
}

/* Define the form data interface */
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

/* Framer Motion variants for step transitions */
const stepVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/* Zod schema for name fields */
const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
type NameFormData = z.infer<typeof nameSchema>;

/** 
 * Formats phone number as (XXX) XXX-XXXX 
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
 * SummaryStep 
 * - Streams AI text 
 * - Has extra right padding (pr-6)
 * - Delays "Proceed" 4s after streaming
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
  const firstNameVal = formData.firstName.trim() || "User";
  const ownerTypeVal = formData.ownerType || "unspecified";
  const propertyDamageVal = formData.propertyDamage
    ? formData.propertyDamage.replace("_", " ")
    : "unspecified";
  const injuredStatusVal =
    formData.injuredStatus === "injured" ? " and injuries" : "";

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
  let prompt = promptParts.filter((part) => part.trim() !== "").join(" ");
  prompt = prompt.replace(/undefined/g, "").replace(/\s+/g, " ").trim();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProceed, setShowProceed] = useState(false);

  // Stream word by word
  useEffect(() => {
    const words = prompt.split(" ").filter((w) => w);
    let index = 0;
    setSummary("");
    setLoading(true);

    const interval = setInterval(() => {
      if (index < words.length) {
        setSummary((prev) => (prev ? prev + " " + words[index] : words[index]));
        index++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 119);

    return () => clearInterval(interval);
  }, [prompt]);

  // Delay "Proceed" by 4 seconds after streaming completes
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowProceed(true), 4000);
      return () => clearTimeout(timer);
    }
    setShowProceed(false);
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
      {/* Extra pr-6 to increase right padding */}
      <div className="mb-4 px-4 pr-6 py-6 sm:py-8 w-full max-w-5xl mx-auto summary-container text-left flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4 mt-8">
            <div className="w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            <span className="text-xl text-gray-600">
              Generating your claim estimate...
            </span>
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
            className="font-[Poppins] w-full py-3 text-lg font-medium sm:min-w-[400px]"
            style={{
              background: "rgba(229, 57, 53, 0.65)",
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(2.5px)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            Proceed
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="font-[Poppins] w-full py-3 text-lg font-medium opacity-50 cursor-not-allowed sm:min-w-[400px]"
            style={{
              background: "rgba(229, 57, 53, 0.65)",
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(2.5px)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            Please wait...
          </button>
        )}

        <div className="mt-2">
          <button
            type="button"
            onClick={onBack}
            className="font-[Poppins] text-blue-400 underline"
          >
            Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * NameStep collects the user's first and last name.
 * Uses Poppins for the question heading and button text.
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  const onNameSubmit = (data: NameFormData) => {
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
      <h2 className="font-[Poppins] text-xl font-medium mb-4">
        Enter your name
      </h2>
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
      {errors.firstName && (
        <p className="text-red-500 text-sm mt-2">{errors.firstName.message}</p>
      )}
      {errors.lastName && (
        <p className="text-red-500 text-sm mt-2">{errors.lastName.message}</p>
      )}
      <div className="mt-6 flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleSubmit(onNameSubmit)}
          className="font-[Poppins] w-full py-3 text-lg font-medium"
          style={{
            background: "rgba(229, 57, 53, 0.65)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            backdropFilter: "blur(2.5px)",
            WebkitBackdropFilter: "blur(2.5px)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          Proceed
        </button>
        <button
          type="button"
          onClick={prevStep}
          className="font-[Poppins] text-blue-400 underline"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}

/**
 * LandingPage manages the multi-step form and submission to your external API.
 * - Headline: Montserrat 800, subhead Montserrat 700
 * - Form question headings & buttons: Poppins
 * - Right padding in AI summary text container
 */
export default function LandingPage() {
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

  // Modals for TOS & Privacy
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

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

  // Submits the multi-step form data to your external API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Example payload mapping
    const payload = {
      offer: "eaton_fire",
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.replace(/\D/g, ""),
      email: formData.email,
      description: formData.summary || "",
      injured: [formData.injuredStatus],
      property_damage: [formData.propertyDamage],
      owner_type: formData.ownerType,
    };

    try {
      const res = await fetch("https://mtimid.com/panel/api/v1/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": "9isnu8117638x972ol9i",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("Error submitting lead", await res.text());
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

        {/* Header with legal ad, logo (until step 4), and Montserrat headline */}
        <header className="w-full px-4 sm:px-6 flex flex-col items-center">
          <p className="attorney-ad">Legal Advertisement</p>
          <div className="flex justify-center w-full">
            {!submitted && currentStep < 4 && (
              <Image
                src={Logo}
                alt="Logo"
                width={100}
                height={100}
                className="pulse-logo"
              />
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
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-300 rounded-full">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-right text-sm text-gray-200 mt-1">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>

              <form onSubmit={handleSubmit} id="multistep-form">
                <AnimatePresence mode="wait">
                  {/* Step 0: "What best describes you?" */}
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
                      <h2 className="font-[Poppins] text-xl font-medium mb-4">
                        What best describes you?
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("ownerType", "Homeowner")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🏠</span>Homeowner
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("ownerType", "Renter")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🏢</span>Renter
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("ownerType", "Business Owner")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">💼</span>Business Owner
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("ownerType", "Multifamily Owner")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🏘️</span>Multifamily
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: "What kind of damage?" */}
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
                      <h2 className="font-[Poppins] text-xl font-medium mb-4">
                        What kind of damage?
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick(
                              "propertyDamage",
                              "property_destroyed"
                            )
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🔥</span>Lost Home
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick(
                              "propertyDamage",
                              "partial_damaged"
                            )
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🏚️</span>Partial Damage
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("propertyDamage", "smoke_damage")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">💨</span>Smoke Damage
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("propertyDamage", "evac_only")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🚨</span>Evacuation Only
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="font-[Poppins] text-blue-600 underline"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: "Were you injured?" */}
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
                      <h2 className="font-[Poppins] text-xl font-medium mb-4">
                        Were you injured?
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("injuredStatus", "injured")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🤕</span>Yes
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionClick("injuredStatus", "not_injured")
                          }
                          className="font-[Poppins] w-full py-3 text-lg font-medium"
                          style={{
                            background: "rgba(229, 57, 53, 0.65)",
                            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                            backdropFilter: "blur(2.5px)",
                            WebkitBackdropFilter: "blur(2.5px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <span className="mr-2">🙅‍♂️</span>No
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="font-[Poppins] text-blue-600 underline"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Name entry */}
                  {currentStep === 3 && (
                    <NameStep
                      setFormData={setFormData}
                      nextStep={nextStep}
                      prevStep={prevStep}
                    />
                  )}

                  {/* Step 4: AI Summary */}
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

                  {/* Step 5: Final contact info + submission */}
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
                      <h2 className="font-[Poppins] text-xl font-medium mb-4">
                        Continue your claim
                      </h2>
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
                          <label
                            htmlFor="tcpa"
                            className="ml-3 text-xs text-gray-400"
                          >
                            By checking this box, I give permission for MTI Firm to contact me via call, email, or text to better service my claim. We do not use autodialers or spam messaging. I understand that my consent is not a requirement or condition of any purchase, and I can opt out at any time by replying STOP.
                          </label>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col">
                        <button
                          type="submit"
                          className="font-[Poppins] py-3 text-lg font-medium w-full sm:min-w-[400px]"
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
                        <button
                          type="button"
                          onClick={prevStep}
                          className="font-[Poppins] mt-2 text-blue-400 underline"
                        >
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
              <h3 className="font-[Poppins] text-2xl font-bold mb-2">
                Thank You!
              </h3>
              <p className="text-gray-700">
                A wildfire claims consultant will contact you shortly.
              </p>
            </div>
          )}
        </footer>

        {/* Legal Links below the form container */}
        {!submitted && (
          <div className="w-full max-w-2xl mx-auto text-center mt-4 pb-4">
            <span
              className="font-[Poppins] text-blue-800 underline cursor-pointer mr-4"
              onClick={() => setShowTerms(true)}
            >
              Terms of Service
            </span>
            <span
              className="font-[Poppins] text-blue-800 underline cursor-pointer"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy Policy
            </span>
          </div>
        )}
      </main>

      {/* Modals for TOS & Privacy */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="MTI FIRM Terms of Service"
        content={TERMS_OF_SERVICE}
      />
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="MTI FIRM Privacy Policy"
        content={PRIVACY_POLICY}
      />
    </>
>>>>>>> 9c6f96b (Initial commit)
  );
}