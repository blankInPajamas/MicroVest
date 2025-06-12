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
  const mdTextAlignClass = inverse ? "md:text-right" : "md:text-left";
  const mdItemsAlignClass = inverse ? "md:items-end" : "md:items-start";

  return (
    <section className="flex items-center justify-center py-16 px-6 sm:px-8 lg:px-12 bg-white">
      <div
        className={`container mx-auto max-w-7xl flex flex-col items-center gap-12 sm:gap-16 ${contentOrderClass}`}
      >
        {/* Text Content */}
        <div className={`flex flex-col items-center text-center md:w-1/2 ${mdTextAlignClass} ${mdItemsAlignClass}`}>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-prose">
            {description}
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 inline-flex items-center justify-center w-full sm:w-auto">
            {buttonText} <span className="ml-2">→</span>
          </button>
        </div>

        {/* Image with Offset Rectangle */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            {/* The actual image */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-lg shadow-xl object-cover relative z-10"
            />
            {/* The black offset rectangle */}
            {/* Hidden by default, shown only on medium screens and up */}
            <div
              className={`hidden md:block absolute w-full h-full bg-black rounded-lg z-0
                ${inverse ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8' : 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8'}
              `}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;