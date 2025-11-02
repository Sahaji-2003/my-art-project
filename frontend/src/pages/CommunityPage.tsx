// ============================================
// src/pages/CommunityPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI, type Post } from '../services/community';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async (searchText: string = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await communityAPI.getPosts(1, 10, searchText);
      setPosts(response.data || []);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts('');
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await communityAPI.getComments(postId, 1, 50);
      setComments(response.data || []);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleStartDiscussion = () => {
    setShowCreateModal(true);
  };

  const handleNewThread = () => {
    setShowCreateModal(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await communityAPI.createPost({
        title: newPostTitle,
        content: newPostContent,
        category: selectedCategory
      });
      setShowCreateModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setSelectedCategory('General');
      await fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostClick = (postId: string) => {
    setSelectedPost(postId);
    fetchComments(postId);
  };

  const handleClosePostDetails = () => {
    setSelectedPost(null);
    setComments([]);
  };

  const handleToggleLike = async (postId: string) => {
    try {
      await communityAPI.toggleLike(postId);
      await fetchPosts();
    } catch (err: any) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await communityAPI.addComment(selectedPost, newComment);
      setNewComment('');
      await fetchComments(selectedPost);
      await fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return postDate.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Marketing': 'bg-primary',
      'Legal': 'bg-danger',
      'Technique': 'bg-info',
      'Inspiration': 'bg-success',
      'Critique': 'bg-warning',
      'General': 'bg-secondary'
    };
    return colors[category] || 'bg-secondary';
  };

  const currentPost = posts.find(p => p._id === selectedPost);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Welcome Section */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h2 className="h2 fw-bold mb-2">Welcome to the Community!</h2>
              <p className="text-muted mb-3">
                Connect, share, and grow with fellow artists. Find collaborations, discover resources, and get insights.
            </p>
              <button className="btn btn-primary btn-sm fw-semibold" onClick={handleStartDiscussion}>
                <i className="bi bi-chat-dots-fill me-2"></i>
                Start Discussion
            </button>
          </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
              <i className="bi bi-people-fill display-3 text-primary opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded shadow-sm p-3 mb-4">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search discussions by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
              {searchQuery && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={handleClearSearch}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Latest Discussion Threads */}
            <div className="bg-white rounded shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h3 fw-bold mb-0">Discussions</h3>
                <button className="btn btn-outline-primary btn-sm" onClick={handleNewThread}>
                  <i className="bi bi-plus-circle me-1"></i>
                  New
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                  <p className="mt-2 text-muted small">Loading...</p>
                </div>
              ) : error && !showCreateModal ? (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                      </div>
              ) : posts.length > 0 ? (
                <div>
                  {posts.map((post) => (
                    <div 
                      key={post._id} 
                      className="border rounded p-3 mb-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handlePostClick(post._id)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="h5 fw-semibold mb-0">{post.title}</h5>
                        <span className={`badge ${getCategoryColor(post.category)} ms-2`}>{post.category || 'General'}</span>
                    </div>
                      <p className="text-muted small mb-2">{post.content.substring(0, 150)}...</p>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="text-primary small">
                          <i className="bi bi-person-circle me-1"></i>
                          {post.author.name}
                        </span>
                        <span className="text-muted small">
                          <i className="bi bi-clock me-1"></i>
                          {formatTimeAgo(post.createdAt)}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-secondary border-0"
                          onClick={(e) => { e.stopPropagation(); handleToggleLike(post._id); }}
                        >
                          <i className="bi bi-heart me-1"></i>
                          {Array.isArray(post.likes) ? post.likes.length : 0}
                        </button>
                        <span className="text-muted small">
                          <i className="bi bi-chat-dots me-1"></i>
                          {Array.isArray(post.comments) ? post.comments.length : 0}
                        </span>
                      </div>
                    </div>
                  ))}
                  </div>
              ) : (
                <div className="alert alert-info text-center py-3">
                  <i className="bi bi-info-circle me-2"></i>
                  No discussions found. Start the first discussion!
                      </div>
              )}
                    </div>
                  </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="bg-white rounded shadow-sm p-3">
              <h5 className="h5 fw-bold mb-3 pb-2 border-bottom">Quick Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleStartDiscussion}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Start Discussion
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/search')}>
                  <i className="bi bi-search me-2"></i>
                  Browse Artworks
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/inventory')}>
                  <i className="bi bi-box-seam me-2"></i>
                  My Inventory
                </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">New Discussion</h5>
                <button type="button" className="btn-close" onClick={() => { setShowCreateModal(false); setError(''); }}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="postTitle" className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="postTitle"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Enter discussion title..."
                      required
                    />
                </div>

                  <div className="mb-3">
                    <label htmlFor="postCategory" className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      id="postCategory"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    >
                      <option value="Marketing">Marketing</option>
                      <option value="Legal">Legal</option>
                      <option value="Technique">Technique</option>
                      <option value="Inspiration">Inspiration</option>
                      <option value="Critique">Critique</option>
                      <option value="General">General</option>
                    </select>
                </div>

                  <div className="mb-3">
                    <label htmlFor="postContent" className="form-label fw-semibold">Content</label>
                    <textarea
                      className="form-control"
                      id="postContent"
                      rows={6}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      required
                    />
                </div>
              </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateModal(false); setError(''); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Create Discussion
                      </>
                    )}
                  </button>
            </div>
              </form>
                </div>
              </div>
            </div>
      )}

      {/* Post Details Modal */}
      {selectedPost && currentPost && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{currentPost.title}</h5>
                <button type="button" className="btn-close" onClick={handleClosePostDetails}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-person-circle fs-4 text-primary"></i>
                  <div>
                    <div className="fw-semibold">{currentPost.author.name}</div>
                    <div className="text-muted small">{formatTimeAgo(currentPost.createdAt)}</div>
              </div>
                  <span className={`badge ${getCategoryColor(currentPost.category)} ms-auto`}>{currentPost.category || 'General'}</span>
                </div>

                <p className="mb-4">{currentPost.content}</p>

                <div className="d-flex gap-3 mb-4">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleToggleLike(currentPost._id)}
                  >
                    <i className="bi bi-heart me-1"></i>
                    {Array.isArray(currentPost.likes) ? currentPost.likes.length : 0} Likes
                  </button>
          </div>

                <div className="border-top pt-3">
                  <h6 className="fw-bold mb-3">Comments ({comments.length})</h6>
                  
                  <form onSubmit={handleAddComment} className="mb-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                      <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-send"></i>
                        )}
                      </button>
                  </div>
                  </form>

                  <div className="comments-list">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="border rounded p-3 mb-2">
                          <div className="d-flex align-items-start gap-2 mb-2">
                            <i className="bi bi-person-circle fs-5 text-primary"></i>
                            <div className="flex-grow-1">
                              <div className="fw-semibold">{comment.author.name}</div>
                              <div className="text-muted small">{formatTimeAgo(comment.createdAt)}</div>
                  </div>
                </div>
                          <p className="mb-0">{comment.content}</p>
                  </div>
                      ))
                    ) : (
                      <p className="text-muted text-center py-3">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
