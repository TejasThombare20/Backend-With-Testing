import mongoose from "mongoose";

const note = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required : [true , "every note must have userId"]
    },

    title: {
      type: String,
      required: [true, "title is required"],
      maxlength: [12, `Length of title must be less than 12`],
    },

    content: {
      type: String,
      required: [true, "content is required"],
    },
    tag: {
      type: String,
      maxlength: [5, `Length of title must be less than 5`],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notes", note);
