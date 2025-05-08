import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const VerificationCodeSchema = new Schema({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  expiresAfter: {
    type: Date,
    index: { expires: 300 },
    default: () => new Date(Date.now() + 300),
  },
});

export const VerificationCode =
  models.VerificationCode || model("VerificationCode", VerificationCodeSchema);

export type VerificationCode = InferSchemaType<
  typeof VerificationCodeSchema
> & {
  _id: Types.ObjectId;
};
