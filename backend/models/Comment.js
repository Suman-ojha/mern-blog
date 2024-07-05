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
      type: Schema.Types.Mixed,
      required: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    likes: {
      type: Array,
      default: [
        {
          userId: { type: Schema.Types.Mixed, },
          username: { type: String }
        }
      ],
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
