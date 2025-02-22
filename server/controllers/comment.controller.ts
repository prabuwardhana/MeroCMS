import type { User } from "@/lib/types";
import Role from "@/constants/role";
import { NOT_FOUND, OK, TOO_MANY_REQUESTS, UNAUTHORIZED } from "@/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import PostModel from "../models/post.model";
import CommentModel from "../models/comment.model";
import { createCommentSchema } from "./comment.schema";

const debounce = new Set();

export const createCommentHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  const { content, parentId } = createCommentSchema.parse({ ...req.body });

  const post = await PostModel.findOne({ slug: req.params.slug });
  appAssert(post, NOT_FOUND, "Post not found");

  appAssert(!debounce.has(userId), TOO_MANY_REQUESTS, "Too many request");

  debounce.add(userId);
  setTimeout(() => {
    debounce.delete(userId);
  }, 30000);

  const comment = await CommentModel.create({ content, author: userId, postSlug: post.slug, parent: parentId });

  post.commentCount += 1;

  await post.save();

  await CommentModel.populate(comment, { path: "author", select: "-password" });

  res.status(OK).json({ comment, message: "comment succesfully created" });
});

export const updateCommentHandler = catchErrors(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  const userRole = req.userRole;

  const { content } = createCommentSchema.parse({ ...req.body });

  const comment = await CommentModel.findById(commentId);
  appAssert(comment, NOT_FOUND, "Comment not found");

  appAssert(
    comment.author._id.toString() === userId?.toString() || userRole?.includes(Role.Admin),
    UNAUTHORIZED,
    "Not authorized",
  );

  comment.content = content;
  comment.edited = true;

  await comment.save();

  res.status(OK).json(comment);
});

export const deleteCommentHandler = catchErrors(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  const userRole = req.userRole;

  const comment = await CommentModel.findById(commentId);
  appAssert(comment, NOT_FOUND, "Comment not found");

  appAssert(
    comment.author._id.toString() === userId?.toString() || userRole?.includes(Role.Admin),
    UNAUTHORIZED,
    "Not authorized",
  );

  await comment.deleteOne();

  const post = await PostModel.findOne({ slug: comment.postSlug });
  appAssert(post, NOT_FOUND, "Post not found");

  post.commentCount = (await CommentModel.find({ postSlug: post.slug })).length;

  await post.save();

  return res.status(OK).json({ message: "Comment is successfully deleted" });
});

export const getCommentsOnPostHandler = catchErrors(async (req, res) => {
  const postSlug = req.params.slug;

  const comments = await CommentModel.find({ postSlug })
    .populate<{ author: User }>({
      path: "author",
      select: "-password",
    })
    .sort("-createdAt");

  let rootComments: typeof comments = [];

  comments.forEach((comment) => {
    if (comment.parent) {
      // If the comment has parent, get the parent comment.
      const parentComment = comments
        .filter((c) => comment.parent && c._id.toString() === comment.parent.toString())
        .shift();
      // Fill the parent's children array with the comment.
      parentComment!.children = [...parentComment!.children, comment];
    } else {
      // The comment is a root comment.
      rootComments = [...rootComments, comment];
    }
  });

  res.status(OK).json(rootComments);
});
