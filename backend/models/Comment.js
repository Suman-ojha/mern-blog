var mongoose = require('mongoose');
var Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(aggregatePaginate)
const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
