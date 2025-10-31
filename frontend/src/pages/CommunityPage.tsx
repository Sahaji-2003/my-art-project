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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await communityAPI.getPosts(1, 10);
      setPosts(response.data || []);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDiscussion = () => {
    // TODO: Navigate to create post page or open modal
    console.log('Start discussion clicked');
  };

  const handleNewThread = () => {
    // TODO: Navigate to create post page or open modal
    console.log('New thread clicked');
  };

  const handlePostClick = (postId: string) => {
    // TODO: Navigate to post details page
    console.log('View details for post:', postId);
  };

  return (
    <div className="community-page bg-light min-vh-100 py-4">
      <div className="community-container container">
        {/* Welcome Section */}
        <div className="welcome-section rounded-4 shadow-sm border-0 overflow-hidden mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7 welcome-content">
              <h1 className="display-4 fw-bold mb-3">Welcome to the Arthub Community!</h1>
              <p className="lead text-muted mb-4">
                Connect, share, and grow with fellow artists and art enthusiasts. 
                Find collaborations, discover resources, and get marketing insights.
              </p>
              <button className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow-sm fw-semibold" onClick={handleStartDiscussion}>
                <i className="bi bi-chat-dots-fill me-2"></i>
                Start a Discussion
              </button>
            </div>
            <div className="col-lg-5 welcome-illustration d-none d-lg-block">
              <div className="artists-illustration text-center">
                <div className="display-1">🎨</div>
              </div>
            </div>
          </div>
        </div>

        <div className="community-content row g-4">
          {/* Main Content */}
          <div className="main-content col-lg-8">
            {/* Latest Discussion Threads */}
            <div className="discussion-section bg-white rounded-4 shadow-sm p-4">
              <div className="section-header d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h2 className="fw-bold mb-2">Latest Discussion Threads</h2>
                  <p className="text-muted mb-0">Join the conversation on various topics.</p>
                </div>
                <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={handleNewThread}>
                  <i className="bi bi-plus-circle me-2"></i>
                  New Thread
                </button>
              </div>

              {loading ? (
                <div className="loading-container text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading discussions...</p>
                </div>
              ) : error ? (
                <div className="error-container text-center py-5">
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                </div>
              ) : posts.length > 0 ? (
                <div className="discussion-list">
                  {posts.map((post) => (
                    <div 
                      key={post._id} 
                      className="discussion-item p-3 bg-light rounded shadow-sm mb-3 cursor-pointer"
                      onClick={() => handlePostClick(post._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex gap-3">
                        <div className="discussion-icon text-primary">
                          <i className="bi bi-chat-dots fs-4"></i>
                        </div>
                        <div className="discussion-content flex-grow-1">
                          <h3 className="fw-semibold mb-2">{post.title}</h3>
                          <p className="text-muted small mb-2">{post.content.substring(0, 150)}...</p>
                          <div className="discussion-meta d-flex align-items-center gap-3 flex-wrap">
                            <span className="author text-primary fw-semibold">
                              <i className="bi bi-person-circle me-1"></i>
                              {post.author.name}
                            </span>
                            <span className="time text-muted small">
                              <i className="bi bi-clock me-1"></i>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="badge bg-secondary">
                              <i className="bi bi-heart-fill me-1"></i>
                              {post.likes || 0}
                            </span>
                            <span className="badge bg-info">
                              <i className="bi bi-chat-dots me-1"></i>
                              {post.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info text-center py-4">
                  <i className="bi bi-info-circle me-2"></i>
                  No discussions available. Start the first discussion!
                </div>
              )}
            </div>

            {/* Additional Community Features - These can be added via API in future */}
            <div className="mt-4 text-center">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                More community features coming soon! Stay tuned for collaboration opportunities and resources.
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar col-lg-4">
            {/* Community Stats */}
            <div className="notifications-section bg-white rounded-4 shadow-sm p-4 mb-4">
              <h3 className="fw-bold mb-3 pb-2 border-bottom">Community Stats</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">Total Posts</span>
                  <span className="fw-bold text-primary">{posts.length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">Active Members</span>
                  <span className="fw-bold text-success">Growing</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">This Week</span>
                  <span className="fw-bold text-info">+{posts.filter(p => {
                    const postDate = new Date(p.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return postDate >= weekAgo;
                  }).length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="notifications-section bg-white rounded-4 shadow-sm p-4">
              <h3 className="fw-bold mb-3 pb-2 border-bottom">Quick Actions</h3>
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-sm rounded-pill" onClick={handleStartDiscussion}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Start Discussion
                </button>
                <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/search')}>
                  <i className="bi bi-search me-2"></i>
                  Browse Artworks
                </button>
                <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/community')}>
                  <i className="bi bi-people me-2"></i>
                  Find Artists
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
