import React, { useEffect, useState } from "react";
import { withFallback } from "vike-react-query";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/Container";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Loader2, RotateCcw, Trash2 } from "lucide-react";

import { convertByteToKiloMegabyte } from "@/lib/utils";
import { CloudinaryResourceType } from "@/lib/types";
import { opacityVariants } from "@/constants/framerMotion";

import { useGetImagesQuery } from "@/hooks/api/useGetImagesQuery";
import { useDeleteImageMutation } from "@/hooks/api/useDeleteImageMutation";

interface MediaGalleryProps {
  onImageSelected: (isChecked: boolean, image: CloudinaryResourceType) => void;
  onClearSelectedImage: () => void;
  selected: Array<CloudinaryResourceType>;
}

interface Deletion {
  state: string;
}

const ImageGallery = withFallback(
  ({ selected, onImageSelected, onClearSelectedImage }: MediaGalleryProps) => {
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [deletion, setDeletion] = useState<Deletion>();
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { pages, fetchNextPage } = useGetImagesQuery(nextCursor);
    const mutation = useDeleteImageMutation(onClearSelectedImage, setDeletion);

    useEffect(() => {
      if (pages[0] !== null) {
        setIsLoadingMore(false);
        setNextCursor(pages[pages.length - 1]!.data.result.next_cursor);
      }
    }, [pages]);

    return (
      <Container className="flex">
        <motion.div layout style={{ width: selected.length ? "75%" : "100%" }} className={"h-[460px] overflow-y-auto"}>
          {Array.isArray(pages) && (
            <AnimatePresence>
              <motion.ul
                key="key"
                variants={opacityVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {pages.map((page) => {
                  return page?.data.result.resources.map((image) => {
                    const isChecked = selected.find((item) => item.secure_url === image.secure_url) ? true : false;

                    return (
                      <li key={image.public_id} className="bg-white dark:bg-zinc-700">
                        <div className="relative group">
                          <label
                            className={`absolute ${isChecked ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity top-3 left-3 p-1`}
                            htmlFor={image.public_id}
                          >
                            <span className="sr-only">Select Image &quot;{image.public_id}&quot;</span>
                            <Checkbox
                              className={`w-6 h-6 rounded-full bg-white shadow ${isChecked ? "border-blue-500" : "border-zinc-200"}`}
                              id={image.public_id}
                              onCheckedChange={() => {
                                onImageSelected(isChecked, image);
                              }}
                              checked={isChecked}
                              disabled={!isChecked && selected.length > 0}
                            />
                          </label>
                          <div
                            className={`block cursor-pointer rounded-xl border-4 transition-[border] ${isChecked ? "border-blue-500" : "border-white"}`}
                            onClick={() => {
                              onImageSelected(isChecked, image);
                            }}
                          >
                            <img
                              width={image.width}
                              height={image.height}
                              src={image.secure_url}
                              alt={image.display_name}
                              className="object-cover object-center w-full h-36 max-w-full rounded-lg"
                            />
                          </div>
                        </div>
                      </li>
                    );
                  });
                })}
              </motion.ul>
            </AnimatePresence>
          )}
          {nextCursor && (
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLoadingMore(true);
                  fetchNextPage();
                }}
              >
                {isLoadingMore && <Loader2 className="animate-spin" />}Load more
              </Button>
            </div>
          )}
        </motion.div>
        <AnimatePresence>
          {!!selected.length && (
            <motion.div
              className="bg-muted p-2 text-nowrap"
              key="image-panel"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "25%" }}
              exit={{ opacity: 0, width: 0 }}
            >
              <img
                width={selected[0].width}
                height={selected[0].height}
                src={selected[0].secure_url}
                alt={selected[0].display_name}
                className="object-cover object-center w-full h-36 max-w-full rounded-lg"
              />
              <div className="mt-2 text-wrap">{selected[0].display_name}</div>
              <dl className="mt-2">
                <div className="flex items-center">
                  <dt className="w-20 text-xs">Format</dt>
                  <dd className="text-sm">{selected[0].format}</dd>
                </div>

                <div className="flex items-center">
                  <dt className="w-20 text-xs">File size</dt>
                  <dd className="text-sm">{convertByteToKiloMegabyte(selected[0].bytes)}</dd>
                </div>

                <div className="flex items-center">
                  <dt className="w-20 text-xs">Dimension</dt>
                  <dd className="text-sm">
                    {selected[0].width} x {selected[0].height}
                  </dd>
                </div>
              </dl>
              <Button
                type="button"
                variant="link"
                className="p-0 flex justify-center items-center text-sm text-destructive"
                onClick={() => {
                  setDeletion({ state: "deleting" });
                  mutation.mutate({ publicId: selected[0].public_id });
                }}
              >
                {deletion?.state === "deleting" ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Delete permanently
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    );
  },
  () => (
    <Container className="h-[460px] flex items-center justify-center">
      <div>Loading Images...</div>
    </Container>
  ),
  ({ retry, error }) => (
    <Container className="h-[460px]">
      <div>Failed to load Images: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </Container>
  ),
);

export default ImageGallery;
