"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../components/HeroHighlight";
import {ContainerScroll} from "../components/container-scroll-animation";
import { BentoGrid, BentoGridItem } from "../components/BentoGrid";
import { BackgroundBeams } from "../components/background-beams";
import { Carousel, Card } from "../components/apple-cards-carousel";
import { cn } from "../../utils/cn";
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconLocationDollar,
  IconReload,
  IconCalendarMonth,
  IconClockPause,
  IconChartBar,
  IconChartPie
} from "@tabler/icons-react";
import { LampContainer } from "../components/lamp";

function Header() {
  const [user] = useAuthState(auth);
  return (
    <div className="w-full h-20 text-gray-100 bg-black flex justify-between py-6 px-8 align-middle sticky">
      <div className="flex text-center">
      <IconLocationDollar stroke={2} className="text-center text-2xl h-12 w-12"/><span className="text-center text-2xl ml-5 mt-2">Budget Wise</span>
      </div>
      
      <Link to={user ? "/dashboard" : "/auth" }>
      <button className="relative inline-flex h-12 w-[100px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
         {user ? "Dashboard" : "Login"}
        </span>
      </button>
      </Link>
    </div>
  )
}
function Section2(){
return (<div className="flex flex-col overflow-hidden">
  <div className="bg-black pt-14 text-center">
<span className='text-6xl font-bold text-white text-center leading-[7rem]'>
  Track Your Spendings and</span><br /><span className='text-6xl font-bold bg-black text-white text-center leading-[7rem]'>boost your Savings
</span>
</div>
  <ContainerScroll
  >
    <img
      src={`src/assets/hero.png`}
      alt="hero"
      height={`200%`}
      width={`100%`}
      className="mx-auto rounded-2xl object-cover h-full object-left-top"
    />
  </ContainerScroll>
</div>);
}

function Section3(){

  return (

    <div className="w-full dark:bg-black text-center">
      <span className='text-6xl font-bold bg-black text-white'>
  Best in Class Features.
</span>
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] dark:bg-black mt-16 pb-20 pt-10">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon} />
      ))}
    </BentoGrid>
    </div>
  );
}

function Section4(){
return (
  <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
      Gain Peace of mind
      </h1>
      <p></p>
      <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
      Manage your money effortlessly and stress-free. Track your spending, stay on top of your budget, and save smarter with complete financial clarity.
      </p>
    </div>
    <BackgroundBeams />
  </div>
);
}

function Section5(){
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Share Expenses <br /> Simplify Settling Up
      </motion.h1>
    </LampContainer>
  );
}



export function Section6() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    (<div className="w-full h-full py-20 bg-black">
      <h2
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Make more with SplitWise.
      </h2>
      <Carousel items={cards} />
    </div>)
  );
}

const data = [
  {
    category: "Track balances",
    title: "Keep track of shared expenses, balances, and who owes who.",
    src: "https://plus.unsplash.com/premium_vector-1726815518464-07d66fa4c1fc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGF5bWVudHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    category: "Organize expenses",
    title: "Split expenses with any group: trips, housemates, friends, and family.",
    src: "https://plus.unsplash.com/premium_vector-1720931652710-7bfbe41ae29a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGF5bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    
  },
  {
    category: "Add expenses easily",
    title: "Quickly add expenses on the go before you forget who paid.",
    src: "https://plus.unsplash.com/premium_vector-1726834804391-7d3c54fc8ee7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWRkJTIwcGF5bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    
  },

  {
    category: "Pay friends back",
    title: "Settle up with a friend and record any cash or online payment.",
    src: "https://plus.unsplash.com/premium_vector-1728185363670-fac38d78db9a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFpZCUyMG9mZnxlbnwwfHwwfHx8MA%3D%3D",
  }
];


const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    (<motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>)
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    (<motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
            backgroundColor : i%2==0 ? "#00E676" : "#D32F2F"
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"></motion.div>
      ))}
    </motion.div>)
  );
};
