import mongoose, { Document, Schema, Types } from "mongoose";

export interface SessionDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userAgent: string;
  ipAddress: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userAgent: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
