import React from "react";
import Navbar from "../../components/Navbar";
import HeroSection01 from "./HeroSection01"
import HeroSection02 from "./HeroSection02";
import FeatureSection from "./FeatureSection";

import pitchIdeasImg from "../../assets/pitch_idea.png";
import investmentEasyImg from "../../assets/technology.png"
import heroImage from "../../assets/landing_hero_section.png";

function LandingPage()
{
    return(
        <>
            <Navbar />
            <HeroSection01 />
            <HeroSection02 />

            <FeatureSection
                title="Pitch Ideas"
                description="Pitch your small business ideas using multimedia i.e. Presentations, Images, Documents"
                buttonText="Get Started"
                imageSrc={pitchIdeasImg} // Use the imported image variable
                imageAlt="People in a meeting room, one person presenting"
            />

            <FeatureSection
                title="Investment Made Easy"
                description="Select from a catalogue of new business ideas and invest to gain ownership"
                buttonText="Get Started"
                imageSrc={investmentEasyImg} // Use the imported image variable
                imageAlt="Smartphone with floating icons"
                inverse={true} // Invert the order for this section
            />

            <FeatureSection
                title="Track Growth"
                description="Use our Dashboard page to track your business's revenue, earnings and statistics"
                buttonText="Get Started"
                imageSrc={heroImage} // Use the imported image variable
                imageAlt="Hand pointing at a financial graph on a screen"
            />
        </>
    );
}

export default LandingPage;