import { Types } from "mongoose";
import type { PostType, User } from "@/lib/types";
import Role from "@/constants/role";
import { NOT_FOUND, OK, TOO_MANY_REQUESTS, UNAUTHORIZED } from "@/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import PostModel from "../models/post.model";
import CommentModel from "../models/comment.model";
import { createCommentSchema, updateCommentSchema } from "./comment.schema";

const debounce = new Set();

export const createCommentHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const { content, parentId } = createCommentSchema.parse({ ...req.body });

  const post = await PostModel.findOne({ slug: req.params.slug });
  appAssert(post, NOT_FOUND, "Post not found");

  appAssert(!debounce.has(userId), TOO_MANY_REQUESTS, "Too many request");

  debounce.add(userId);
  setTimeout(() => {
    debounce.delete(userId);
  }, 30000);

  const approved = userRole?.includes(Role.Admin) ? true : false;

  const comment = await CommentModel.create({
    content,
    author: userId,
    post: post._id,
    parent: new Types.ObjectId(parentId as string),
    approved,
  });

  post.commentCount += 1;

  await post.save();

  await CommentModel.populate(comment, { path: "author", select: "-password" });

  res.status(OK).json({ comment, message: "comment succesfully created" });
});

export const updateCommentHandler = catchErrors(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  const userRole = req.userRole;

  const { content } = updateCommentSchema.parse({ ...req.body });

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

  const post = await PostModel.findById(comment.post);
  appAssert(post, NOT_FOUND, "Post not found");

  post.commentCount = (await CommentModel.find({ post: post._id })).length;

  await post.save();

  return res.status(OK).json({ message: "Comment is successfully deleted" });
});

export const getCommentsOnPostHandler = catchErrors(async (req, res) => {
  const postSlug = req.params.slug;

  const post = await PostModel.findOne({ slug: postSlug });
  appAssert(post, NOT_FOUND, "Post not found");

  const comments = await CommentModel.find({ post: post._id })
    .populate<{ author: User }>({
      path: "author",
      select: "-password",
    })
    .sort({ createdAt: "desc" });

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

export const getCommentsHandler = catchErrors(async (req, res) => {
  const comments = await CommentModel.find({})
    .populate<{ author: User }>({
      path: "author",
      select: "-password",
    })
    .populate<{ post: PostType }>({
      path: "post",
      select: ["title", "slug"],
    })
    .sort({ createdAt: "desc" })
    .exec();
  res.status(OK).json(comments);
});

export const getCommentHandler = catchErrors(async (req, res) => {
  const comment = await CommentModel.findById(req.params.commentId)
    .populate<{ author: User }>({
      path: "author",
      select: "-password",
    })
    .exec();

  appAssert(comment, NOT_FOUND, "Category not found");

  const post = (await PostModel.findById(comment.post).select(["title", "slug"])) as PostType;

  res.status(OK).json({
    author: comment.author,
    post: {
      title: post.title,
      slug: post.slug,
    },
    content: comment.content,
  });
});

export const approveCommentHandler = catchErrors(async (req, res) => {
  const commentId = req.params.commentId;

  const comment = await CommentModel.findById(commentId);
  appAssert(comment, NOT_FOUND, "Comment not found");

  comment.approved = !comment.approved;

  await comment.save();

  res.status(OK).json({ comment: { approved: comment.approved }, message: "success" });
});
