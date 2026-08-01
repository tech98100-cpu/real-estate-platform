import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "responded", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
