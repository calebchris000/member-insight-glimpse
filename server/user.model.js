import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    loggedIn: { type: Boolean, required: false },
    loggedInCount: { type: Number, required: false, default: 0 },
    lastLogin: { type: Date, required: false },
    lastLogout: { type: Date, required: false },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
