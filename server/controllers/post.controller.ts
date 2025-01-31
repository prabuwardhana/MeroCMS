import { NOT_FOUND, OK } from "../constants/http";
import PostModel from "../models/post.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { createPostSchema } from "./post.schema";

export const upsertPostHandler = catchErrors(async (req, res) => {
  const { _id, title, slug, editorContent, published, authorId, coverImage } = createPostSchema.parse({
    ...req.body,
  });

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
        authorId,
        coverImage,
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
      authorId,
      coverImage,
    });
  }

  res.status(OK).json({ post, message: "post succesfully created" });
});

export const getPostHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findOne({ _id: req.params.postId });
  appAssert(post, NOT_FOUND, "Post not found");

  res.status(OK).json({
    title: post.title,
    slug: post.slug,
    editorContent: post.editorContent,
    published: post.published,
    authorId: post.authorId,
    coverImage: post.coverImage,
    updatedAt: post.updatedAt,
  });
});
