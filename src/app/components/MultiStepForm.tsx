"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function MultiStepForm() {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
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
    console.log("Submitted data:", formData);
    setSubmitted(true);
    // Here you would normally send the data to your API.
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-300 rounded-full">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {submitted ? (
        // Success Message
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-gray-700">
            A wildfire claims consultant will contact you shortly.
          </p>
        </div>
      ) : (
        <form id="multistep-form" onSubmit={handleSubmit}>
          {/* Step 1: Owner Type */}
          <Transition
            show={currentStep === 0}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="form-step">
              <h2 className="text-xl font-bold mb-4">
                What best describes you?
              </h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOptionClick("ownerType", "Homeowner")}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionClick("ownerType", "Renter")}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Renter
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("ownerType", "Business Owner")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Business Owner
                </button>
              </div>
            </div>
          </Transition>

          {/* Step 2: Damage Type */}
          <Transition
            show={currentStep === 1}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="form-step">
              <h2 className="text-xl font-bold mb-4">What kind of damage?</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("propertyDamage", "property_destroyed")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Lost Home
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("propertyDamage", "partial_damaged")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Partial Damage
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("propertyDamage", "smoke_damage")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Smoke Damage
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("propertyDamage", "evac_only")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Evacuation Only
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
            </div>
          </Transition>

          {/* Step 3: Injury */}
          <Transition
            show={currentStep === 2}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="form-step">
              <h2 className="text-xl font-bold mb-4">Were you injured?</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOptionClick("injuredStatus", "injured")}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleOptionClick("injuredStatus", "not_injured")
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded"
                >
                  No
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
            </div>
          </Transition>

          {/* Step 4: Contact Info + TCPA */}
          <Transition
            show={currentStep === 3}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="form-step">
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
                  <label htmlFor="tcpa" className="text-sm text-gray-700">
                    I consent to be contacted regarding my claim.
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
                  className="bg-green-600 text-white py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </Transition>
        </form>
      )}
    </div>
  );
}