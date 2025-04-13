import mongoose from "mongoose";

export const ActivityType = {
  LOGIN: "login",
  LOGOUT: "logout",
  VISIT: "page_visit",
};
const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    route: {
      type: String,
      required: false,
    },
  },

  { timestamps: true },
);

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
