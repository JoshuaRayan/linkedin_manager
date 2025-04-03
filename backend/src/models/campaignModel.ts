import mongoose, { type Document, Schema } from "mongoose"

export interface ICampaign extends Document {
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE" | "DELETED"
  leads: string[]
  accountIDs: string[]
}

const CampaignSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED"],
      default: "ACTIVE",
    },
    leads: { type: [String], default: [] },
    accountIDs: { type: [String], default: [] },
  },
  { timestamps: true },
)

export default mongoose.model<ICampaign>("Campaign", CampaignSchema)

