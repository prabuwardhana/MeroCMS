import mongoose from "mongoose";

export interface CommentDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  author: mongoose.Types.ObjectId;
  postSlug: string;
  content: string;
  parent: mongoose.Types.ObjectId;
  children: Array<mongoose.Document<unknown> & Omit<CommentDocument, "author">>;
  edited: boolean;
}

const commentSchema = new mongoose.Schema<CommentDocument>(
  {
    author: { ref: "User", required: true, type: mongoose.Schema.Types.ObjectId },
    postSlug: { ref: "Post", required: true, type: String },
    content: { type: String, required: true },
    parent: { ref: "Comment", type: mongoose.Schema.Types.ObjectId },
    children: [{ type: mongoose.Schema.Types.Mixed }],
    edited: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

commentSchema.post("deleteOne", { document: true, query: false }, async function (doc, next) {
  const comments = await this.model("Comment").find({ parent: this._id });

  comments.forEach(async (comment) => {
    await comment.deleteOne();
  });

  next();
});

const CommentModel = mongoose.model<CommentDocument>("Comment", commentSchema);

export default CommentModel;
