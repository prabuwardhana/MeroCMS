import type { CategoryType, User } from "@/core/lib/types";
import { NOT_FOUND, OK } from "@/core/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import CategoryModel from "../models/category.model";
import PostModel from "../models/post.model";
import { createPostSchema } from "./post.schema";

export const upsertPostHandler = catchErrors(async (req, res) => {
  const {
    _id,
    title,
    slug,
    excerpt,
    documentJson,
    documentHtml,
    published,
    publishedAt,
    author,
    coverImage,
    categories: cat,
  } = createPostSchema.parse({
    ...req.body,
  });

  const categories = await CategoryModel.find({ name: { $in: cat } }).select("_id");
  const categoryIds = categories.map((category) => category._id);

  // create new or update existing post
  let post;
  if (_id) {
    post = await PostModel.findOneAndUpdate(
      { _id },
      {
        title,
        slug,
        excerpt,
        documentJson,
        documentHtml,
        published,
        publishedAt,
        author,
        coverImage,
        categories: categories.length ? categoryIds : [],
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    post = await PostModel.create({
      title,
      slug,
      excerpt,
      documentJson,
      documentHtml,
      published,
      publishedAt,
      author,
      coverImage,
      categories: categories.length ? categoryIds : [],
    });
  }

  res.status(OK).json({ post, message: "post succesfully created" });
});

export const getPostsHandler = catchErrors(async (req, res) => {
  const posts = await PostModel.find({})
    .sort({ createdAt: "desc" })
    .select(["title", "slug", "published", "publishedAt", "coverImage", "author", "categories"])
    .populate<{ author: User }>({ path: "author", select: "profile" })
    .populate<{ categories: CategoryType[] }>({ path: "categories", select: "name" })
    .exec();
  res.status(OK).json(posts);
});

export const getPostByIdHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findOne({ _id: req.params.postId })
    .populate<{ categories: CategoryType[] }>({ path: "categories", select: "name" })
    .exec();
  appAssert(post, NOT_FOUND, "Post not found");

  res.status(OK).json({
    ...post.toObject(),
    categories: post?.categories.map((item) => item.name),
  });
});

export const getPostBySlugHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findOne({ slug: req.params.slug })
    .populate<{ author: User }>({ path: "author", select: "profile" })
    .populate<{ categories: CategoryType[] }>({ path: "categories", select: "name" })
    .exec();
  appAssert(post, NOT_FOUND, "Post not found");
  appAssert(post.published, NOT_FOUND, "Post not found");

  res.status(OK).json({
    ...post.toObject(),
    author: post.author.profile,
    categories: post?.categories.map((item) => item.name),
  });
});

export const getPostPreviewHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findOne({ _id: req.params.postId })
    .populate<{ author: User }>({ path: "author", select: "profile" })
    .populate<{ categories: CategoryType[] }>({ path: "categories", select: "name" })
    .exec();
  appAssert(post, NOT_FOUND, "Post not found");

  res.status(OK).json({
    ...post.toObject(),
    author: post.author.profile,
    categories: post?.categories.map((item) => item.name),
  });
});

export const publishPostHandler = catchErrors(async (req, res) => {
  const postId = req.params.postId;

  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, "Comment not found");

  post.published = !post.published;
  post.publishedAt = post.published ? new Date() : null;

  await post.save();

  res.status(OK).json({ post: { published: post.published }, message: "success" });
});

export const deletePostById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await PostModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "Post is successfully deleted",
  });
});
