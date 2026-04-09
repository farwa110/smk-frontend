// // "use client";

// // import { useState } from "react";
// // import { useSignIn } from "@clerk/nextjs";
// // import { useRouter } from "next/navigation";

// // export default function ForgotPasswordPage() {
// //   // Clerk-funktioner og router initialiseres
// //   const { isLoaded, signIn, setActive } = useSignIn();
// //   const router = useRouter();

// //   // State til email, kode, ny adgangskode og fejl
// //   const [email, setEmail] = useState("");
// //   const [code, setCode] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [step, setStep] = useState("request"); // To trin: "request" eller "reset"
// //   const [error, setError] = useState("");

// //   // Første trin: send nulstillingskode til brugerens e-mail
// //   const handleRequest = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     try {
// //       await signIn.create({
// //         strategy: "reset_password_email_code",
// //         identifier: email,
// //       });
// //       setStep("reset"); // Gå videre til næste trin: kode + ny adgangskode
// //     } catch (err) {
// //       setError(err.errors?.[0]?.message || "Noget gik galt.");
// //     }
// //   };

// //   // Andet trin: bruger indtaster kode + ny adgangskode for at nulstille
// //   const handleReset = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     try {
// //       const result = await signIn.attemptFirstFactor({
// //         strategy: "reset_password_email_code",
// //         code,
// //         password,
// //       });

// //       // Hvis alt lykkes, log brugeren ind og send til forsiden
// //       if (result.status === "complete") {
// //         await setActive({ session: result.createdSessionId });
// //         router.push("/");
// //       } else {
// //         setError("Verifikation mislykkedes.");
// //       }
// //     } catch (err) {
// //       setError(err.errors?.[0]?.message || "Noget gik galt.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center px-4 pb-70">
// //       <div className="max-w-md w-full space-y-6 p-6 border rounded shadow-sm bg-white text-center">
// //         <h1 className="text-2xl font-bold">Gendan adgangskode</h1>

// //         {/* Vis første trin: brugeren anmoder om kode via e-mail */}
// //         {step === "request" ? (
// //           <form onSubmit={handleRequest} className="space-y-4">
// //             <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
// //               Send nulstillingskode
// //             </button>
// //           </form>
// //         ) : (
// //           // Andet trin: brugeren indtaster kode og ny adgangskode
// //           <form onSubmit={handleReset} className="space-y-4">
// //             <input type="text" placeholder="Verifikationskode" className="w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
// //             <input type="password" placeholder="Ny adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //             <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
// //               Nulstil adgangskode
// //             </button>
// //           </form>
// //         )}

// //         {/* Fejlmeddelelse vises, hvis noget går galt */}
// //         {error && <p className="text-red-600 text-center">{error}</p>}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const { isLoaded, signIn } = useSignIn();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const [password, setPassword] = useState("");
//   const [step, setStep] = useState("request"); // request | verify | password
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRequest = async (e) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     setError("");
//     setIsLoading(true);

//     try {
//       const { error: createError } = await signIn.create({
//         identifier: email,
//       });

//       if (createError) {
//         setError(createError.message || "Kunne ikke starte nulstilling.");
//         return;
//       }

//       const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();

//       if (sendCodeError) {
//         setError(sendCodeError.message || "Kunne ikke sende kode.");
//         return;
//       }

//       setStep("verify");
//     } catch (err) {
//       console.error("Forgot password request error:", err);
//       setError(err?.errors?.[0]?.message || "Noget gik galt.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     setError("");
//     setIsLoading(true);

//     try {
//       const { error } = await signIn.resetPasswordEmailCode.verifyCode({
//         code,
//       });

//       if (error) {
//         setError(error.message || "Forkert kode.");
//         return;
//       }

//       setStep("password");
//     } catch (err) {
//       console.error("Verify code error:", err);
//       setError(err?.errors?.[0]?.message || "Verifikation mislykkedes.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!isLoaded) return;

//     setError("");
//     setIsLoading(true);

//     try {
//       const { error } = await signIn.resetPasswordEmailCode.submitPassword({
//         password,
//       });

//       if (error) {
//         setError(error.message || "Kunne ikke opdatere adgangskode.");
//         return;
//       }

//       if (signIn.status === "complete") {
//         const { error: finalizeError } = await signIn.finalize({
//           navigate: async ({ decorateUrl }) => {
//             const url = decorateUrl("/");
//             router.push(url);
//           },
//         });

//         if (finalizeError) {
//           setError(finalizeError.message || "Kunne ikke logge ind.");
//         }
//       } else if (signIn.status === "needs_second_factor") {
//         setError("2-faktor login kræves, men er ikke håndteret her endnu.");
//       } else {
//         setError("Nulstilling blev ikke fuldført.");
//       }
//     } catch (err) {
//       console.error("Submit password error:", err);
//       setError(err?.errors?.[0]?.message || "Noget gik galt.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 pb-70">
//       <div className="max-w-md w-full space-y-6 p-6 border rounded shadow-sm bg-white text-center">
//         <h1 className="text-2xl font-bold">Gendan adgangskode</h1>

//         {step === "request" && (
//           <form onSubmit={handleRequest} className="space-y-4">
//             <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={isLoading}>
//               {isLoading ? "Sender..." : "Send nulstillingskode"}
//             </button>
//           </form>
//         )}

//         {step === "verify" && (
//           <form onSubmit={handleVerify} className="space-y-4">
//             <input type="text" placeholder="Verifikationskode" className="w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
//             <button type="submit" className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50" disabled={isLoading}>
//               {isLoading ? "Bekræfter..." : "Bekræft kode"}
//             </button>
//           </form>
//         )}

//         {step === "password" && (
//           <form onSubmit={handleResetPassword} className="space-y-4">
//             <input type="password" placeholder="Ny adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-50" disabled={isLoading}>
//               {isLoading ? "Opdaterer..." : "Gem ny adgangskode"}
//             </button>
//           </form>
//         )}

//         {error && <p className="text-red-600 text-center">{error}</p>}
//       </div>
//     </div>
//   );
// }

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

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
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
