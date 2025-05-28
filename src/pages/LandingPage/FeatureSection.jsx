import React from "react";

function FeatureSection({
  title,
  description,
  buttonText,
  imageSrc,
  imageAlt,
  inverse = false, // Default to false
}) {
  const contentOrderClass = inverse ? "md:flex-row-reverse" : "md:flex-row";
  // Determine text alignment class based on inverse prop
  const textAlignClass = inverse ? "md:text-right" : "md:text-left";
  // Determine item alignment for the flex column (for button alignment)
  const itemsAlignClass = inverse ? "md:items-end" : "md:items-start";


  return (
    <section className="flex items-center justify-center py-16 px-6 bg-white">
      <div
        className={`container mx-auto flex flex-col items-center gap-12 ${contentOrderClass}`}
      >
        {/* Text Content */}
        {/* Added flex-col to enable items-alignment, and conditional text & items alignment */}
        <div className={`flex flex-col md:w-1/2 ${textAlignClass} ${itemsAlignClass}`}>
          <h3 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            {description}
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 flex items-center">
            {buttonText} <span className="ml-2">→</span>
          </button>
        </div>

        {/* Image with Offset Rectangle */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            {/* The actual image */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-lg shadow-xl object-cover relative z-10"
            />
            {/* The black offset rectangle */}
            {/* Conditional offset for inverse, adjusting top/left or right/bottom */}
            <div className={`absolute w-full h-full bg-black rounded-lg z-0 ${inverse ? 'bottom-4 right-4' : 'top-4 left-4'}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;