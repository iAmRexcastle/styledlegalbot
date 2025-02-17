"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function ChatBotFunnel() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [trackingData, setTrackingData] = useState<any>({});
  const [formData, setFormData] = useState({
    propertyDamage: "",
    injuredStatus: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Capture tracking parameters (UTM, click IDs, referrer) on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clickid = urlParams.get("clickid") || urlParams.get("gclid") || urlParams.get("fbclid");
    const utm_source = urlParams.get("utm_source");
    const utm_campaign = urlParams.get("utm_campaign");
    const utm_medium = urlParams.get("utm_medium");
    setTrackingData({
      clickid,
      utm_source,
      utm_campaign,
      utm_medium,
      referrer: document.referrer || null,
    });
  }, []);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const leadPayload = { ...trackingData, ...formData };

    try {
      const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
      if (response.ok) {
        setStep(4);
      } else {
        console.error("Lead submission failed");
      }
    } catch (error) {
      console.error("Error submitting lead", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="glass-morphism w-full max-w-lg mx-auto p-8 space-y-6">
        <ProgressBar step={step} totalSteps={4} />

        {/* Step 1: Property Damage */}
        <Transition
          show={step === 1}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">What best describes your property damage?</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, propertyDamage: "property_destroyed" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Lost Home
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, propertyDamage: "partial_damaged" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Partial Damage
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, propertyDamage: "smoke_damage" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Smoke Damage
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, propertyDamage: "evac_only" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Evacuation Only
              </button>
            </div>
          </div>
        </Transition>

        {/* Step 2: Injury Status */}
        <Transition
          show={step === 2}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Were you injured?</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, injuredStatus: "injured" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, injuredStatus: "not_injured" });
                  nextStep();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                No
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </div>
        </Transition>

        {/* Step 3: Contact Information */}
        <Transition
          show={step === 3}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Tell us about you</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="p-2 border rounded"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="p-2 border rounded"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                required
                className="p-2 border rounded"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                className="p-2 border rounded"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </Transition>

        {/* Step 4: Confirmation */}
        <Transition
          show={step === 4}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">All Set!</h2>
            <p>Thanks for submitting your info. Our team will contact you soon.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push("/thank-you")}
            >
              Go to Thank You Page
            </button>
          </div>
        </Transition>
      </div>
    </div>
  );
}

function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const percentage = Math.min((step / totalSteps) * 100, 100);
  return (
    <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-4">
      <div
        className="bg-blue-600 h-2 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}