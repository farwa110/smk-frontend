"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("request");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStep("reset");
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Noget gik galt.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleReset = async (e) => {
  //   e.preventDefault();
  //   if (!isLoaded) return;

  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const result = await signIn.attemptFirstFactor({
  //       strategy: "reset_password_email_code",
  //       code: code.trim(),
  //       password,
  //     });

  //     if (result.status === "complete") {
  //       await setActive({ session: result.createdSessionId });
  //       router.push("/");
  //     } else {
  //       setError("Nulstilling blev ikke fuldført.");
  //     }
  //   } catch (err) {
  //     setError(err?.errors?.[0]?.message || "Noget gik galt.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError("Nulstilling blev ikke fuldført.");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Noget gik galt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-70">
      <div className="max-w-md w-full space-y-6 p-6 border rounded shadow-sm bg-white text-center">
        <h1 className="text-2xl font-bold">Gendan adgangskode</h1>

        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={isLoading}>
              {isLoading ? "Sender..." : "Send nulstillingskode"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input type="text" placeholder="Verifikationskode" className="w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
            <input type="password" placeholder="Ny adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50" disabled={isLoading}>
              {isLoading ? "Opdaterer..." : "Nulstil adgangskode"}
            </button>
          </form>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
