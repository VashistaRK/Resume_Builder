import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform  } from "framer-motion";
import { FaAward } from "react-icons/fa";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { cn } from "../../lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import HeroSection from "./HeroSection";
import RingCheckpoints from "@/Pages/LandingPage/TyoesRing";
import ContactPage from "../ContactPage";
import TextScramble from "@/components/common/Text-Animate";
import { resumeTemplates } from "../../data/resumeTemplates";
import { RESUME_FEATURES } from "@/data/Features";
import { ATS_FEATURES } from "@/data/FutureScope";
/*eslint-disable*/


interface Template {
  name: string;
  image: string;
  featured?: boolean;
}

const myPhrases = ["Free  &  Best Resume Templates to Download and Edit"];

const HoverCard: React.FC<{ template: Template }> = ({ template }) => {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };

    handleResize(); // check on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 flex-shrink-0 opacity-80 transition-all duration-500 ${
        hover ? "scale-105 z-20" : ""
      }`}
       style={{
        width: isMobile ? "14rem" : hover ? "27rem" : "25rem",
        height: isMobile ? "20rem" : hover ? "35rem" : "33rem",
      }}
    >
      <div className="relative w-full h-full group">
        <img
          src={template.image}
          alt={`${template.name} resume template preview`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <nav className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {template.name}
        </nav>
      </div>
    </article>
  );
};

const ResumeLandingPage: React.FC = () => {
  const secRef = useRef<HTMLDivElement>(null);
  // const isInView = useInView(secRef, { once: false, margin: "-100px" });
  const featuredTemplates = resumeTemplates.filter((t) => t.featured);

  return (
    <>
      <HeroSection />

      <div className="relative flex flex-col items-center px-4 sm:px-8 md:px-16 xl:px-24">
        <nav className="mt-10 text-3xl md:text-5xl xl:text-6xl font-bold text-center max-w-5xl">
          <TextScramble phrases={myPhrases} />
        </nav>

        <div className="w-full mt-10 p-6 rounded-3xl shadow-lg">
          <header className="flex items-center gap-4 mb-6">
            <span className="text-purple-600 text-4xl">
              <FaAward />
            </span>
            <h2 className="text-2xl md:text-4xl font-Quick font-semibold text-stone-300">
              Expert's Choice Resume Templates
            </h2>
          </header>

          <p className="text-gray-600 mb-8">
            Looking for a resume template that can help you get more interviews?
            These were picked by certified resume writers as top options in
            today's job market.
          </p>

          <nav className="relative w-full overflow-hidden py-8 my-10">
            <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-full overflow-hidden">
              <div className="flex animate-scroll gap-4">
                {[...featuredTemplates, ...featuredTemplates].map((t, i) => (
                  <HoverCard key={`${t.name}-${i}`} template={t} />
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <RingCheckpoints />

      <section className="flex flex-col justify-center items-center py-16 px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text">
            ResumeForge
          </span>
          ?
        </h2>

        <div className="max-w-6xl w-full grid auto-rows-[200px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {RESUME_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, rotate: 2 }}
              className={`flex relative flex-col items-center justify-center space-y-4 rounded-2xl p-6 shadow-lg border border-gray-700 bg-opacity-10 backdrop-blur-lg hover:shadow-xl transition-transform duration-300 ${
                index % 4 === 0
                  ? "md:col-span-2 md:row-span-2"
                  : "md:col-span-1"
              }`}
            >
              <motion.div
                className="text-purple-400 text-5xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              >
                {feature.icon}
              </motion.div>
              <p className="text-gray-200 text-[16px] md:text-lg font-medium">
                {feature.title}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Section */}
      <section
        ref={secRef}
        className="relative text-white py-16 px-4 w-full overflow-hidden"
      >
        <InteractiveGridPattern
          className={cn(
            "inset-x-[17%] inset-y-[10%] justify-end h-full skew-y-15 z-10",
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />

        <div className="max-w-6xl mx-auto flex flex-col">
          {/* Static Main Text - Sticky Left */}
          
          <div className="max-w-xl w-full lg:w-1/2 top-20 self-start">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-stone-100">
              <BoxReveal boxColor={"#737E82"} duration={0.5}>
              Future Scope
              </BoxReveal>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-stone-400">
              <BoxReveal boxColor={"#737E82"} duration={0.5}>
              Resumes optimized based on job description (ATS)
              </BoxReveal>
            </h2>
            <div className="text-stone-400">
              <BoxReveal boxColor={"#737E82"} duration={0.5}>
              Our platform dynamically generates ATS-optimized resumes using job
              descriptions, scaling with more intelligent tools and features.
              </BoxReveal>
            </div>
          </div>
          {/* Features Section */}
          <div className="flex flex-col w-full space-y-16 pt-10 lg:mt-10">
            {ATS_FEATURES.map((f, i) => {
              const featureRef = useRef(null);
              const { scrollYProgress } = useScroll({
                target: featureRef,
                offset: ["start end", "end start"],
              });

              // Transform values for bidirectional animation
              const x = useTransform(
                scrollYProgress,
                [0, 0.3, 0.7, 1],
                [i % 2 === 0 ? 100 : -100, 0, 0, i % 2 === 0 ? 100 : -100]
              );

              const opacity = useTransform(
                scrollYProgress,
                [0, 0.3, 0.7, 1],
                [0, 1, 1, 0]
              );

              const scale = useTransform(
                scrollYProgress,
                [0, 0.3, 0.7, 1],
                [0.8, 1, 1, 0.8]
              );

              return (
                <motion.div
                  key={i}
                  ref={featureRef}
                  style={{ x, opacity, scale }}
                  className={`w-full flex ${
                    i % 2 === 0 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-sm flex flex-col gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <p className="p-2 bg-white/20 rounded-md">{f.icon}</p>
                      <h3 className="text-xl font-semibold">{f.title}</h3>
                    </div>
                    <p className="text-base text-white/80">{f.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <ContactPage />
    </>
  );
};

export default ResumeLandingPage;
