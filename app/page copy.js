"use client"  
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <-- Add this import

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);
  const router = useRouter(); // <-- Initialize router
  useEffect(() => {
    // When we hit 100%, go to login:
    if (progress >= 100) {
      router.push("/login");
      return;
    }

    // Kick off the next tick in 0.2s instead of 20s:
    const timer = setTimeout(() => {
      setProgress(old => Math.min(old + Math.random() * 10, 100));
    }, 1000);

    // Reveal the preview images at 40%:
    if (progress >= 40 && !imagesVisible) {
      setImagesVisible(true);
    }

    return () => clearTimeout(timer);
  }, [progress, imagesVisible]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#171717] to-[#212121] dark:from-[#171717] dark:to-[#212121] transition-colors duration-500 font-['Poppins']">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-400/5 dark:bg-indigo-300/5 blur-md"
            style={{
              width: `${Math.random() * 60 + 30}px`,
              height: `${Math.random() * 60 + 30}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animation: `float ${Math.random() * 15 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Dynamic Logo */}
      <div className="relative w-28 h-28 m-12">
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#1981ee] to-[#15487d] dark:from-[#1981ee] dark:to-[#15487d] shadow-lg animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white dark:bg-[#171717] flex items-center justify-center shadow-md">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fd5900] to-[#ffde00] dark:from-[#fd5900] dark:to-[#ffde00]">
            I8
            <Image
              src={'/logo/logo.png'}
              alt="InfoEight Logo"
              fill
              className="object-contain bg-white rounded-full "
              priority
            />
          </span>
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-[#ffffff]/20 dark:border-[#ffffff]/10 animate-spin-slow" />
      </div>

      {/* App Name with Modern Typography */}
      {/* <h1 class */}

      <p className="text-base text-white/80 dark:text-[#93a1a1] mb-8 text-center max-w-md px-6 leading-relaxed">
        Intelligent analytics for the modern enterprise
      </p>

      {/* "Best School App" text above images */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Best School App
          </span>
        </h2>
      </div>
      <div className="w-64 h-2 bg-[#00000020] dark:bg-[#00000040] rounded-full overflow-hidden mb-3 relative">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, var(--color-blue), var(--color-white))" // blue to white
          }}
        />
      </div>

      {/* Status Message */}
      <div className="flex items-center gap-2 text-sm text-white/70 dark:text-[#93a1a1]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#fd5900] dark:bg-[#fd5900] animate-pulse mr-1" />
        {progress < 30
          ? "Initializing modules..."
          : progress < 60
            ? "Loading resources..."
            : progress < 90
              ? "Preparing workspace..."
              : progress < 100
                ? "Almost ready..."
                : showLogin
                  ? (
                    <button
                      onClick={() => router.push('/login')}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#fd5900] to-[#ffde00] text-white font-semibold shadow-md hover:scale-105 transition-transform"
                    >
                      Login
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  )
                  : ""}
      </div>
      {/* App UI Preview Images with responsive layout */}
      {/* App UI Preview Images with responsive layout */}
      <div className=" relative w-full py-12 px-4 md:py-16 md:px-8 overflow-hidden">
        <div
          className={`flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 transition-all duration-1000 ${imagesVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
        >
          {/* App UI Preview Image 1 */}
          <div
            className="relative w-80 md:w-96  xl: h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden border border-white/10 mx-auto md:mx-0"
            style={{
              transitionDelay: "100ms",
              transform: imagesVisible
                ? "translateY(0) rotate(-5deg)"
                : "translateY(20px) rotate(-5deg)",
            }}
          >
            <Image
              src={"/splash/splashOne/splashOne@3x.png"}
              alt="App UI preview 1"
              fill
              className="object-contain w-full h-full p-2 bg-white"
              priority
            />
          </div>

          {/* App UI Preview Image 2 */}
          <div
            className="relative w-80 md:w-96  xl: h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden border border-white/10 mx-auto md:mx-0"
            style={{
              transitionDelay: "200ms",
            }}
          >
            <Image
              src={"/splash/splashTwo/splashTwo@3x.png"}
              alt="App UI preview 2"
              fill
              className="object-contain w-full h-full p-2 bg-white"
              priority
            />
          </div>

          {/* App UI Preview Image 3 */}
          <div
            className="relative w-80 md:w-96  xl: h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden border border-white/10 mx-auto md:mx-0"
            style={{
              transitionDelay: "300ms",
              transform: imagesVisible
                ? "translateY(0) rotate(5deg)"
                : "translateY(20px) rotate(5deg)",
            }}
          >
            <Image
              src={"/splash/splashThree/splashThree@3x.png"}
              alt="App UI preview 3"
              fill
              className="object-contain w-full h-full p-2 bg-white"
              priority
            />
          </div>
        </div>
      </div>
      {/* Animated Progress Indicator */}


      {/* Float animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}