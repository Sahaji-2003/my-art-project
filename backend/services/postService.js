// services/postService.js
const Post = require('../models/Post');
const Comment = require('../models/Comment');

class PostService {
  async createPost(authorId, postData) {
    const post = await Post.create({
      authorId,
      ...postData
    });

    return await this.getPostById(post._id);
  }

  async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate('authorId', 'name email profilePicture');

    if (!post) {
      throw new Error('Post not found');
    }

    // Increment views
    post.views += 1;
    await post.save();

    return post;
  }

  async getAllPosts(page = 1, limit = 10, searchQuery = '') {
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $unwind: {
          path: '$authorInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          // Add searchable fields for text search
          searchableText: {
            $concat: [
              { $ifNull: ['$title', ''] },
              ' ',
              { $ifNull: ['$content', ''] },
              ' ',
              { $ifNull: ['$category', ''] },
              ' ',
              { $ifNull: ['$authorInfo.name', ''] }
            ]
          }
        }
      }
    ];

    // Add text search filter if query exists
    if (searchQuery && searchQuery.trim()) {
      pipeline.push({
        $match: {
          searchableText: { $regex: searchQuery.trim(), $options: 'i' }
        }
      });
    }

    // Add sorting
    pipeline.push({ $sort: { isPinned: -1, createdAt: -1 } });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Post.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Project final fields with populated author info
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        category: 1,
        likes: 1,
        views: 1,
        isPinned: 1,
        createdAt: 1,
        updatedAt: 1,
        authorId: {
          _id: '$authorInfo._id',
          name: '$authorInfo.name',
          email: '$authorInfo.email',
          profilePicture: '$authorInfo.profilePicture'
        }
      }
    });

    const posts = await Post.aggregate(pipeline);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updatePost(postId, authorId, updateData) {
    const post = await Post.findOneAndUpdate(
      { _id: postId, authorId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('authorId', 'name email profilePicture');

    if (!post) {
      throw new Error('Post not found or unauthorized');
    }

    return post;
  }

  async deletePost(postId, authorId) {
    const post = await Post.findOneAndDelete({ _id: postId, authorId });

    if (!post) {
      throw new Error('Post not found or unauthorized');
    }

    // Delete all comments for this post
    await Comment.deleteMany({ postId });

    return { message: 'Post deleted successfully' };
  }

  async toggleLike(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    return await post.populate('authorId', 'name email profilePicture');
  }

  async addComment(postId, authorId, content) {
    const comment = await Comment.create({
      postId,
      authorId,
      content
    });

    return await this.getCommentById(comment._id);
  }

  async getCommentById(commentId) {
    const comment = await Comment.findById(commentId)
      .populate('authorId', 'name email profilePicture');

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  }

  async getCommentsForPost(postId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ postId })
        .populate('authorId', 'name email profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ postId })
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async toggleCommentLike(commentId, userId) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    return comment;
  }

  async deleteComment(commentId, authorId) {
    const comment = await Comment.findOneAndDelete({ _id: commentId, authorId });

    if (!comment) {
      throw new Error('Comment not found or unauthorized');
    }

    return { message: 'Comment deleted successfully' };
  }
}

module.exports = new PostService();

