import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { opacityVariants } from "@/constants/framerMotion";
import { convertByteToKiloMegabyte } from "@/lib/utils";
import type { ExtendedFile } from "@/lib/types";

import { Progress } from "@/components/ui/progress";

interface UploadProgressCardProps {
  files: ExtendedFile[];
}

const UploadProgressCard = ({ files }: UploadProgressCardProps) => {
  return (
    <AnimatePresence>
      {files.map(({ file, id, uploadProgress }) => (
        <motion.div
          key={id}
          variants={opacityVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center gap-2 border rounded-md p-4 mb-4 bg-muted"
        >
          <img src={(file as File & { preview: string }).preview} className="h-12 w-12 rounded-md" />
          <div className="flex flex-col flex-1">
            <span className="text-sm">{file.name}</span>
            <span className="text-xs">{convertByteToKiloMegabyte(file.size)}</span>
            <Progress value={uploadProgress} className="h-2"></Progress>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default UploadProgressCard;
