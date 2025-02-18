import React, { useEffect, useState } from 'react';
import { checkAIAvailability } from "@/app/actions";

export default function EnvCard() {
  const [aiAvailable, setAIAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      const result = await checkAIAvailability();
      setAIAvailable(result);
    }
    fetchAvailability();
  }, []);

  if (aiAvailable === null) {
    // Optionally render a loading state; here we render nothing while waiting.
    return null;
  }

  return !aiAvailable && (
    <div className="absolute inset-0 top-10 left-0 right-0 flex items-center justify-center w-md">
      <div className="bg-red-500 text-slate-50 rounded shadow-md p-2 leading-tight">
        <h2 className="text-sm font-bold">Heads up!</h2>
        <p className="text-xs flex flex-col">
          <span>You need to add an OPENAI_API_KEY as an environment variable.</span>
          <span>See the .env.example file for an example.</span>
        </p>
      </div>
    </div>
  );
}
