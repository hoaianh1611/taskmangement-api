const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignee: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ], //one to one optional
    status: {
      type: String,
      enum: ["pending", "working", "review", "done", "archive"],
      required: true,
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
