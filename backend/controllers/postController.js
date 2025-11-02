// controllers/postController.js
const postService = require('../services/postService');

exports.createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    const postObj = post.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (postObj.authorId) {
      postObj.author = postObj.authorId;
      delete postObj.authorId;
    }
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postObj
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.postId);
    const postObj = post.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (postObj.authorId) {
      postObj.author = postObj.authorId;
      delete postObj.authorId;
    }
    
    res.status(200).json({
      success: true,
      data: postObj
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = '' } = req.query;
    const result = await postService.getAllPosts(parseInt(page), parseInt(limit), q);
    
    // Transform authorId to author for frontend compatibility
    // Note: Aggregation returns plain objects, not Mongoose documents
    const transformedPosts = result.posts.map(post => {
      // Already a plain object from aggregation
      if (post.authorId) {
        post.author = post.authorId;
        delete post.authorId;
      }
      // Keep likes array for frontend compatibility
      // Transform comments to count (comments are stored separately)
      post.comments = 0; // Will be calculated if needed
      return post;
    });
    
    res.status(200).json({
      success: true,
      data: transformedPosts,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.postId, req.user.id, req.body);
    const postObj = post.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (postObj.authorId) {
      postObj.author = postObj.authorId;
      delete postObj.authorId;
    }
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: postObj
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await postService.deletePost(req.params.postId, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const post = await postService.toggleLike(req.params.postId, req.user.id);
    const postObj = post.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (postObj.authorId) {
      postObj.author = postObj.authorId;
      delete postObj.authorId;
    }
    
    res.status(200).json({
      success: true,
      data: postObj
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const comment = await postService.addComment(req.params.postId, req.user.id, req.body.content);
    const commentObj = comment.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (commentObj.authorId) {
      commentObj.author = commentObj.authorId;
      delete commentObj.authorId;
    }
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: commentObj
    });
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await postService.getCommentsForPost(req.params.postId, parseInt(page), parseInt(limit));
    
    // Transform authorId to author for frontend compatibility
    const transformedComments = result.comments.map(comment => {
      const commentObj = comment.toObject();
      if (commentObj.authorId) {
        commentObj.author = commentObj.authorId;
        delete commentObj.authorId;
      }
      return commentObj;
    });
    
    res.status(200).json({
      success: true,
      data: transformedComments,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await postService.toggleCommentLike(req.params.commentId, req.user.id);
    const commentObj = comment.toObject();
    
    // Transform authorId to author for frontend compatibility
    if (commentObj.authorId) {
      commentObj.author = commentObj.authorId;
      delete commentObj.authorId;
    }
    
    res.status(200).json({
      success: true,
      data: commentObj
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const result = await postService.deleteComment(req.params.commentId, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

