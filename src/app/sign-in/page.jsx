// "use client";

// import { useState } from "react";
// import { useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const { isLoaded, signIn, setActive } = useSignIn();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const [password, setPassword] = useState("");
//   const [step, setStep] = useState("request");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRequest = async (e) => {
//     e.preventDefault();
//     if (!isLoaded) return;
//     setError("");
//     setIsLoading(true);
//     try {
//       await signIn.create({
//         strategy: "reset_password_email_code",
//         identifier: email,
//       });
//       setStep("reset");
//     } catch (err) {
//       setError(err.errors?.[0]?.message || "Noget gik galt.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e) => {
//     e.preventDefault();
//     if (!isLoaded) return;
//     setError("");
//     setIsLoading(true);
//     try {
//       const result = await signIn.attemptFirstFactor({
//         strategy: "reset_password_email_code",
//         code,
//         password,
//       });
//       if (result.status === "complete") {
//         await setActive({ session: result.createdSessionId });
//         router.push("/");
//       } else {
//         setError("Verifikation mislykkedes.");
//       }
//     } catch (err) {
//       setError(err.errors?.[0]?.message || "Noget gik galt.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 pb-70">
//       <div className="max-w-md w-full space-y-6 p-6 border rounded shadow-sm bg-white text-center">
//         <h1 className="text-2xl font-bold">Gendan adgangskode</h1>

//         {step === "request" ? (
//           <form onSubmit={handleRequest} className="space-y-4">
//             <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
//               {isLoading ? "Sender..." : "Send nulstillingskode"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleReset} className="space-y-4">
//             <input type="text" placeholder="Verifikationskode" className="w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
//             <input type="password" placeholder="Ny adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50">
//               {isLoading ? "Opdaterer..." : "Nulstil adgangskode"}
//             </button>
//           </form>
//         )}

//         {error && <p className="text-red-600">{error}</p>}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSignIn, useSignUp, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const [view, setView] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const changeState = (newView) => {
    setError("");
    setView(newView);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!signInLoaded) return;
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        router.push("/events");
      } else {
        setError("Login ikke fuldført.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Noget gik galt ved login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setError("");
    setIsLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setView("verify");
    } catch (err) {
      setError(err.errors?.[0]?.message || "Noget gik galt ved oprettelse.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!signUp) {
      setError("Session udløbet – start forfra.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const complete = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (complete.status === "complete") {
        await setSignUpActive({ session: complete.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Forkert kode.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verifikation mislykkedes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-60">
      <SignedIn>
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">Du er allerede logget ind ✅</p>
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="max-w-md w-full space-y-6 p-6 border rounded shadow-sm bg-white">
          <h1 className="text-2xl font-bold text-center">{view === "login" ? "Log ind" : view === "signup" ? "Opret konto" : "Bekræft kode"}</h1>

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-sm text-gray-500">Behandler...</p>
            </div>
          ) : view === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-blue-500 underline hover:text-blue-700">
                  Glemt adgangskode?
                </a>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Log ind
              </button>
              <p className="text-sm text-center">
                Har du ikke en bruger?{" "}
                <button type="button" onClick={() => changeState("signup")} className="text-orange-500 underline">
                  Opret konto
                </button>
              </p>
            </form>
          ) : view === "signup" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Adgangskode" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">
                Opret konto
              </button>
              <p className="text-sm text-center">
                Allerede bruger?{" "}
                <button type="button" onClick={() => changeState("login")} className="text-blue-500 underline">
                  Log ind
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <input type="text" placeholder="Verifikationskode" className="w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                Bekræft konto
              </button>
            </form>
          )}

          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
      </SignedOut>
    </div>
  );
}
