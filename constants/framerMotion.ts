export const containerVariants = {
  close: {
    width: "60px",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.3,
    },
  },
  open: {
    width: "240px",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.3,
    },
  },
} as const;

export const opacityVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "linear",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "linear",
    },
  },
} as const;

export const dropInVariant = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
} as const;
