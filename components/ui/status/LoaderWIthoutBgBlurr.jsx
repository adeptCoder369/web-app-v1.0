import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const LoaderWIthoutBgBlurr = () => {
    return (
        <>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-md"
                aria-live="polite"
                role="status"
            >
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative flex items-center justify-center">
                        {/* A more subtle, pulsing background effect */}
                        <div className="absolute w-24 h-24 rounded-full bg-purple-500/20 animate-ping" />
                        <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-xl p-4">
                            <Image
                                src="/logo/logo.png"
                                alt="Loading content, please wait..."
                                width={64}
                                height={64}
                                className="animate-fade-in-up"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                        <p className="text-white text-xl font-semibold tracking-wide">
                            Loading
                        </p>
                    </div>
                </div>
            </div>
            {/* The `animate-fade-in-up` is a custom Tailwind animation. 
                You would need to add this to your tailwind.config.js file:

                // tailwind.config.js
                module.exports = {
                  theme: {
                    extend: {
                      keyframes: {
                        'fade-in-up': {
                          '0%': { opacity: '0', transform: 'translateY(10px)' },
                          '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        'spin': {
                            from: { transform: 'rotate(0deg)' },
                            to: { transform: 'rotate(360deg)' },
                        }
                      },
                      animation: {
                        'fade-in-up': 'fade-in-up 0.5s ease-out',
                        'spin': 'spin 1s linear infinite',
                        // ... other animations
                      },
                    },
                  },
                  // ...
                };
            */}
        </>
    );
};

export default LoaderWIthoutBgBlurr;