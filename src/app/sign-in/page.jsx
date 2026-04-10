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
        router.push("/mediebibliotek");
      } else {
        setError("Forkert kode.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verifikation mislykkedes.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    if (!signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/events",
      });
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Google login failed.");
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

      {/* <SignedOut>
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

        <div className="flex items-center gap-2 my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">eller</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded border border-gray-300 hover:bg-gray-50">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.07 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.08 5.5C12.4 13.36 17.73 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.7c-.55 2.96-2.2 5.46-4.68 7.14l7.18 5.57C43.44 37.27 46.52 31.36 46.52 24.5z" />
            <path fill="#FBBC05" d="M10.72 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.94 23.94 0 0 0 0 24c0 3.86.92 7.5 2.54 10.72l8.18-6.4z" />
            <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.94l-7.18-5.57C28.6 38.1 26.42 39 24 39c-6.27 0-11.6-3.86-13.28-9.18l-8.18 6.4C6.07 43.52 14.45 47 24 47z" />
          </svg>
          Fortsæt med Google
        </button>
      </SignedOut> */}
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

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-400 text-sm">eller</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded border border-gray-300 hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.07 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.08 5.5C12.4 13.36 17.73 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.7c-.55 2.96-2.2 5.46-4.68 7.14l7.18 5.57C43.44 37.27 46.52 31.36 46.52 24.5z" />
              <path fill="#FBBC05" d="M10.72 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.94 23.94 0 0 0 0 24c0 3.86.92 7.5 2.54 10.72l8.18-6.4z" />
              <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.94l-7.18-5.57C28.6 38.1 26.42 39 24 39c-6.27 0-11.6-3.86-13.28-9.18l-8.18 6.4C6.07 43.52 14.45 47 24 47z" />
            </svg>
            Fortsæt med Google
          </button>
        </div>
      </SignedOut>
    </div>
  );
}
