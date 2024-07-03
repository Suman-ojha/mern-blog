var mongoose = require('mongoose');
var Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
postSchema.plugin(aggregatePaginate)
const Post = mongoose.model('posts', postSchema);

module.exports = Post;
