import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const playerSchema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: "User" },
  friends: { type: [Types.ObjectId], ref: "Player", default: [] },
  isOnline: { type: Boolean, default: false },
});

export const Player = models.Player || model("Player", playerSchema);
export type Player = InferSchemaType<typeof playerSchema> & {
  _id: Types.ObjectId;
};
