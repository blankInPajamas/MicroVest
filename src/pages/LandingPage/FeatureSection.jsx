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

  return (
    <section className="flex items-center justify-center py-16 px-6 bg-white">
      <div
        className={`container mx-auto flex flex-col items-center gap-12 ${contentOrderClass}`}
      >
        {/* Text Content */}
        <div className="text-left md:w-1/2">
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

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-lg shadow-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;