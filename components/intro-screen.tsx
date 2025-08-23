'use client'

import { useState, useEffect } from 'react'
import { Zap, Sun, Battery, Leaf } from 'lucide-react'

interface IntroScreenProps {
  onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showMainLogo, setShowMainLogo] = useState(false)

  useEffect(() => {
    const timeline = [
      // Step 0: Show icons animation
      { step: 0, delay: 500 },
      // Step 1: Show main logo
      { step: 1, delay: 1500 },
      // Step 2: Fade out and complete
      { step: 2, delay: 2500 }
    ]

    timeline.forEach(({ step, delay }) => {
      setTimeout(() => {
        if (step === 1) {
          setShowMainLogo(true)
        } else if (step === 2) {
          onComplete()
        }
        setCurrentStep(step)
      }, delay)
    })
  }, [onComplete])

  const icons = [
    { Icon: Sun, color: 'text-orange-500', delay: 'delay-0' },
    { Icon: Zap, color: 'text-yellow-500', delay: 'delay-100' },
    { Icon: Battery, color: 'text-green-500', delay: 'delay-200' },
    { Icon: Leaf, color: 'text-emerald-500', delay: 'delay-300' }
  ]

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-orange-900/20 to-yellow-900/20 animate-pulse"></div>
      
      {/* Solar energy particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center">
        {/* Icon Animation Phase */}
        <div 
          className={`mb-8 transition-all duration-1000 ${
            showMainLogo ? 'opacity-0 scale-75 translate-y-4' : 'opacity-100 scale-100'
          }`}
        >
          <div className="flex justify-center items-center gap-6 mb-6">
            {icons.map(({ Icon, color, delay }, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 ease-out ${delay} ${
                  currentStep >= 0 
                    ? 'opacity-100 scale-100 translate-y-0 animate-bounce' 
                    : 'opacity-0 scale-50 translate-y-8'
                }`}
              >
                <Icon className={`h-12 w-12 ${color} drop-shadow-glow`} />
              </div>
            ))}
          </div>
          
          {/* Connecting lines animation */}
          <div className="flex justify-center items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500 ${
                  currentStep >= 0 ? 'w-12 opacity-100' : 'w-0 opacity-0'
                }`}
                style={{ transitionDelay: `${(i + 1) * 200}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Main Logo Phase */}
        <div 
          className={`transition-all duration-1000 ease-out ${
            showMainLogo 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-75 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Zap className="h-16 w-16 text-orange-500 drop-shadow-2xl animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 bg-orange-500/20 rounded-full blur-xl animate-ping"></div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                EkoSolar
              </h1>
              <p className="text-2xl font-semibold text-gray-300 mt-1 tracking-wider">
                CRM
              </p>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-lg text-gray-400 font-light tracking-wide">
            Powering Your Solar Business
          </p>
          
          {/* Loading indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Energy wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/10 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  )
}