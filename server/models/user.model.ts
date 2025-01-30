import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import Role from "../constants/role";

export interface ProfileDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  _id: mongoose.Types.ObjectId;
  username: string;
}

export interface UserDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  email: string;
  password: string;
  verified: boolean;
  role: Role[];
  profile: ProfileDocument;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<UserDocument, "_id" | "email" | "verified" | "createdAt" | "updatedAt">;
}

const profileSchema = new mongoose.Schema<ProfileDocument>({
  username: { type: String, required: true, unique: true },
});

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    role: { type: [String], required: true, default: [Role.Customer] },
    profile: profileSchema,
  },
  {
    timestamps: true,
  },
);

// Hash the submitted password before saving it to the DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  return next();
});

// Hash the submitted password, then compare it with the hashed password in the DB
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

// Don't send the password back to the client
userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
