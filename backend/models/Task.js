const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Task must belong to a user"],
        },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    date: {
      type: Date,
      required: [true, "Task date is required"],
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);