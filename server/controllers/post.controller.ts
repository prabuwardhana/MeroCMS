import { CategoryType } from "@/lib/types";
import { NOT_FOUND, OK } from "../constants/http";
import CategoryModel from "../models/category.model";
import PostModel from "../models/post.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { createPostSchema } from "./post.schema";

export const upsertPostHandler = catchErrors(async (req, res) => {
  const {
    _id,
    title,
    slug,
    editorContent,
    published,
    author,
    coverImage,
    categories: cat,
  } = createPostSchema.parse({
    ...req.body,
  });

  const categories = await CategoryModel.find({ name: { $in: cat } }).select("_id");
  appAssert(categories.length, NOT_FOUND, "Category not found");

  const categoryIds = categories.map((category) => category._id);

  // create new or update existing post
  let post;
  if (_id) {
    post = await PostModel.findOneAndUpdate(
      { _id },
      {
        title,
        slug,
        editorContent,
        published,
        author,
        coverImage,
        categories: categoryIds,
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
      editorContent,
      published,
      author,
      coverImage,
      categories: categoryIds,
    });
  }

  res.status(OK).json({ post, message: "post succesfully created" });
});

export const getSinglePostByIdHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findOne({ _id: req.params.postId })
    .populate<{ categories: CategoryType[] }>({ path: "categories", select: "name" })
    .exec();
  appAssert(post, NOT_FOUND, "Post not found");

  res.status(OK).json({
    title: post.title,
    slug: post.slug,
    editorContent: post.editorContent,
    published: post.published,
    authorId: post.authorId,
    coverImage: post.coverImage,
    categories: post?.categories.map((item) => item.name),
    updatedAt: post.updatedAt,
  });
});
