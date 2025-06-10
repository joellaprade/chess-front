import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, default: "" },
  username: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: false },
});

export const User = models.User || model("User", userSchema);

export type User = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  save: () => Promise<void>;
};
