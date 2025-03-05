import type { User } from "@/lib/types";
import { NOT_FOUND, OK } from "@/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import PageModel from "../models/page.model";
import { createPageSchema } from "./page.schema";

export const upsertPageHandler = catchErrors(async (req, res) => {
  const { _id, title, slug, excerpt, fields, published, publishedAt, author, coverImageUrl } = createPageSchema.parse({
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
        excerpt,
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
      excerpt,
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

  const mapKeys = (obj: Record<string, string>, fn: (key: string) => string) =>
    Object.keys(obj).reduce(
      (acc, key: string) => {
        if (!["widgetId", "fieldId", "fieldLabels", "fieldsTitle", "fieldsCount"].includes(key))
          acc[fn(key)] = obj[key];
        return acc;
      },
      <Record<string, string>>{},
    );

  const pageFieldsJson = page.fields?.reduce(
    (acc, field) => {
      acc[field["fieldId"]] = mapKeys(field, (key) => key.split("_")[0]);
      return acc;
    },
    <Record<string, Record<string, string>>>{},
  );

  res.status(OK).json({ ...page.toObject(), pageFieldsJson: JSON.stringify(pageFieldsJson, null, 2) });
});

export const getPageBySlugHandler = catchErrors(async (req, res) => {
  const page = await PageModel.findOne({ slug: req.params.slug });
  appAssert(page, NOT_FOUND, "Page not found");

  const mapKeys = (obj: Record<string, string>, fn: (key: string) => string) =>
    Object.keys(obj).reduce(
      (acc, key: string) => {
        if (!["widgetId", "fieldId", "fieldLabels", "fieldsTitle", "fieldsCount"].includes(key))
          acc[fn(key)] = obj[key];
        return acc;
      },
      <Record<string, string>>{},
    );

  const pageFieldsJson = page.fields?.reduce(
    (acc, field) => {
      acc[field["fieldId"]] = mapKeys(field, (key) => key.split("_")[0]);
      return acc;
    },
    <Record<string, Record<string, string>>>{},
  );

  res.status(OK).json({
    title: page.title,
    excerpt: page.excerpt,
    coverImageUrl: page.coverImageUrl,
    content: JSON.stringify(pageFieldsJson),
  });
});

export const publishPageHandler = catchErrors(async (req, res) => {
  const pageId = req.params.pageId;

  const page = await PageModel.findById(pageId);
  appAssert(page, NOT_FOUND, "Page not found");

  page.published = !page.published;
  page.publishedAt = page.published ? new Date() : null;

  await page.save();

  res.status(OK).json({ page: { published: page.published }, message: "Succesfully publishing page" });
});

export const deletePageById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await PageModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "A page is successfully deleted",
  });
});
