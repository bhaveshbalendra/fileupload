import mongoose, { Document, Schema, Types } from "mongoose";
import type { SessionDocument } from "../types/database.types";

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
