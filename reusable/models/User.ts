// models/User.ts
import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  username: { type: String, required: false },
  password: { type: String, required: false },
});

// The model
export const User = models.User || model("User", userSchema);

// The type
export type UserType = InferSchemaType<typeof userSchema> & {
  _id?: Types.ObjectId;
};
