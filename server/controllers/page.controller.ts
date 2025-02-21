import type { User } from "@/lib/types";
import { NOT_FOUND, OK } from "@/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import PageModel from "../models/page.model";
import { createPageSchema } from "./page.schema";

export const upsertPageHandler = catchErrors(async (req, res) => {
  const { _id, title, slug, fields, published, publishedAt, author, coverImageUrl } = createPageSchema.parse({
    ...req.body,
  });

  // create new or update existing page
  let page;
  if (_id) {
    page = await PageModel.findOneAndUpdate(
      { _id },
      {
        title,
        slug,
        fields,
        published,
        publishedAt,
        author,
        coverImageUrl,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    page = await PageModel.create({
      title,
      slug,
      fields,
      published,
      publishedAt,
      author,
      coverImageUrl,
    });
  }

  res.status(OK).json({ page, message: "page succesfully created" });
});

export const getPagesHandler = catchErrors(async (req, res) => {
  const pages = await PageModel.find({})
    .sort({ createdAt: "desc" })
    .select(["title", "slug", "published", "coverImageUrl", "author"])
    .populate<{ author: User }>({ path: "author", select: "profile" })
    .exec();
  res.status(OK).json(pages);
});

export const getPageByIdHandler = catchErrors(async (req, res) => {
  const page = await PageModel.findOne({ _id: req.params.pageId });
  appAssert(page, NOT_FOUND, "Page not found");

  res.status(OK).json({
    title: page.title,
    slug: page.slug,
    fields: page.fields,
    published: page.published,
    publishedAt: page.publishedAt,
    author: page.author,
    coverImageUrl: page.coverImageUrl,
    updatedAt: page.updatedAt,
  });
});

export const deletePageById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await PageModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "A page is successfully deleted",
  });
});
