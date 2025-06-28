"use client";
import React from "react";
import { motion } from "motion/react";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="font-medium text-white hover:text-gray-200 transition-colors cursor-pointer"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="top-[calc(100%_+_1.2rem)] left-1/2 absolute pt-4 -translate-x-1/2 transform">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white/95 shadow-xl backdrop-blur-sm border border-[#c9cfd1] rounded-2xl overflow-hidden"
              >
                <motion.div
                  layout
                  className="p-4 w-max h-full"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative flex justify-center space-x-4 bg-black shadow-input px-8 py-6 border dark:border-white/[0.2] border-transparent"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="group flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shadow-2xl group-hover:shadow-lg rounded-md transition-shadow shrink-0"
      />
      <div>
        <h4 className="mb-1 font-bold text-black group-hover:text-gray-700 text-xl transition-colors">
          {title}
        </h4>
        <p className="max-w-[10rem] text-gray-700 group-hover:text-gray-600 text-sm transition-colors">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="block hover:bg-[#c9cfd1]/20 px-3 py-2 rounded-lg text-black hover:text-gray-700 transition-all duration-200"
    >
      {children}
    </a>
  );
};