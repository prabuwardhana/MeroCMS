import { v2 as cloudinary } from "cloudinary";
import { OK } from "@/src/constants/http";
import catchErrors from "../utils/catchErrors";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getResourcesHandler = catchErrors(async (req, res) => {
  const result = await cloudinary.api.resources({
    max_results: 12,
    resource_type: "image",
    ...(req.params.next_cursor !== "null" && { next_cursor: req.params.next_cursor }),
  });

  res.status(OK).json({ result });
});

export const deleteResourceHandler = catchErrors(async (req, res) => {
  const { publicId } = req.body;
  const result = await cloudinary.uploader.destroy(publicId);

  res.status(OK).json({ result });
});
