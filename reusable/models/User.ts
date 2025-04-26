// models/User.ts
import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// The model
export const User = models.User || model("User", userSchema);

// The type
export type User = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};
