import React, { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  phrases: string[];
}

const TextScramble: React.FC<TextScrambleProps> = ({ phrases }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => (prevCounter + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="loader text-stone-400 text-4xl font-bold my-20" ref={el}>
      {phrases[counter].split(" ").map((char, index) => (
        <span
          key={index}
          className="loader-span mr-2"
          style={{
            animationDelay: `${index * 70}ms`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default TextScramble;
