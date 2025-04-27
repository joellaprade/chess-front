import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const sessionSchema = new Schema({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  playerId: { type: String, required: true },
  user: {
    required: true,
    type: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  expiresAfter: {
    type: Date,
    index: { expires: 0 },
    default: () => new Date(Date.now() + 60 * 60 * 1000),
  },
});

export const Session = models.Session || model("Session", sessionSchema);
export type Session = InferSchemaType<typeof sessionSchema> & {
  _id: Types.ObjectId;
};
