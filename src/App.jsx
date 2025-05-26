import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <h1 className="text-3xl">
        Is nomnom nomnom-ing properly?
      </h1>

      {/* Test Tailwind Div - Add this below your h1 */}
      <div className="
        min-h-screen                 // Make the div take at least the full viewport height
        flex                         // Enable Flexbox
        items-center                 // Center items vertically
        justify-center               // Center items horizontally
        bg-gradient-to-r             // Gradient background
        from-teal-400                // Start gradient color
        to-blue-500                  // End gradient color
        p-8                          // Padding
      ">
        <div className="
          bg-white                   // White background for the inner box
          p-10                       // More padding
          rounded-xl                   // Rounded corners
          shadow-2xl                 // Large shadow
          text-center                // Center text inside
          text-gray-800              // Dark text color
          max-w-md                   // Max width to keep it from stretching too wide
          mx-auto                    // Center horizontally within its parent (if parent wasn't flex-centered)
          transform                  // Enable transformations
          hover:scale-105            // Scale up on hover
          transition                 // Smooth transition for hover effect
          duration-300               // Transition duration
          ease-in-out                // Transition timing function
        ">
          <h2 className="text-4xl font-extrabold text-purple-700 mb-4">
            Tailwind Is Working! 🎉
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            If you see this box beautifully styled with colors, shadows, and rounded corners,
            then congratulations! Tailwind CSS is successfully integrated.
          </p>
          <button className="
            bg-green-600              // Green button background
            hover:bg-green-700        // Darker green on hover
            text-white                // White text
            font-bold                 // Bold font
            py-3 px-6                 // Padding
            rounded-full              // Fully rounded button
            shadow-lg                 // Shadow for button
            transition duration-200   // Smooth transition
          ">
            Awesome!
          </button>
        </div>
      </div>
    </>
  )
}

export default App
