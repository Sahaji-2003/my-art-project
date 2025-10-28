// ============================================
// src/pages/CommunityPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { communityAPI, type Post } from '../services/community';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

const CommunityPage: React.FC = () => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleStartDiscussion = () => {
    // Navigate to create post page or open modal
    console.log('Start discussion clicked');
  };

  const handleNewThread = () => {
    // Navigate to create post page or open modal
    console.log('New thread clicked');
  };

  const handleViewDetails = (postId: string) => {
    // Navigate to post details page
    console.log('View details for post:', postId);
  };

  return (
    <div className="container-fluid py-4">
      {/* Welcome Section */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="text-center">
            <h1 className="display-4 text-primary mb-3">Welcome to the Arthub Community!</h1>
            <p className="lead text-muted mb-4">
              Connect, share, and grow with fellow artists and art enthusiasts. 
              Find collaborations, discover resources, and get marketing insights.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleStartDiscussion}>
              <i className="bi bi-chat-dots me-2"></i>
              Start a Discussion
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="text-center">
            <div className="fs-1 mb-3">🎨</div>
            <div className="d-flex justify-content-center gap-3 mb-3">
              <div className="fs-2">🖌️</div>
              <div className="fs-2">📸</div>
              <div className="fs-2">✏️</div>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <div className="fs-3">🖼️</div>
              <div className="fs-3">🎭</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Latest Discussion Threads */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5 mb-1 text-primary">Latest Discussion Threads</h2>
                <p className="text-muted mb-0">Join the conversation on various topics.</p>
              </div>
              <button className="btn btn-outline-primary btn-sm" onClick={handleNewThread}>
                <i className="bi bi-chat-dots me-1"></i>
                New Thread
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading discussions...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-chat-dots text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Tips for selling art online in 2024?</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>by ArtfulCreator</span>
                        <span>2 hours ago</span>
                        <span className="badge bg-primary">Marketing</span>
                      </div>
                    </div>
                  </div>

                  <div className="list-group-item d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-chat-dots text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Best practices for protecting your artwork copyrights</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>by LegalCanvas</span>
                        <span>yesterday</span>
                        <span className="badge bg-warning">Legal</span>
                      </div>
                    </div>
                  </div>

                  <div className="list-group-item d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-chat-dots text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Sharing experience with digital painting tools</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>by PixelBrush</span>
                        <span>3 days ago</span>
                        <span className="badge bg-info">Technique</span>
                      </div>
                    </div>
                  </div>

                  <div className="list-group-item d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-chat-dots text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Finding inspiration in everyday life</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>by DailyMuse</span>
                        <span>1 week ago</span>
                        <span className="badge bg-success">Inspiration</span>
                      </div>
                    </div>
                  </div>

                  <div className="list-group-item d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-chat-dots text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Feedback wanted: My latest abstract series</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>by ColorFlow</span>
                        <span>2 weeks ago</span>
                        <span className="badge bg-secondary">Critique</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collaboration Opportunities */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-1 text-primary">Collaboration Opportunities</h2>
              <p className="text-muted mb-0">Find artists for your next project or offer your skills.</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Illustrator needed for children's book project</h5>
                      <p className="card-text text-muted">Looking for a talented illustrator to bring whimsical characters to life in a children's book series.</p>
                      <div className="mt-auto">
                        <span className="badge bg-primary mb-2">Illustration</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Photographer for urban art documentation</h5>
                      <p className="card-text text-muted">Seeking a photographer to capture mural art and street installations for a gallery exhibition.</p>
                      <div className="mt-auto">
                        <span className="badge bg-info mb-2">Photography</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Graphic designer for art event branding</h5>
                      <p className="card-text text-muted">Creative designer to help with logos, flyers, and digital marketing materials for upcoming art events.</p>
                      <div className="mt-auto">
                        <span className="badge bg-success mb-2">Graphic Design</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Videographer for artist studio tour</h5>
                      <p className="card-text text-muted">Create an engaging video tour of my studio space for social media and portfolio purposes.</p>
                      <div className="mt-auto">
                        <span className="badge bg-warning mb-2">Videography</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Web developer to build artist portfolio site</h5>
                      <p className="card-text text-muted">Seeking a developer to build a modern, responsive portfolio website for showcasing artwork.</p>
                      <div className="mt-auto">
                        <span className="badge bg-secondary mb-2">Web Development</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">3D Artist for virtual gallery experience</h5>
                      <p className="card-text text-muted">Collaborate on creating an immersive 3D virtual gallery space for online art exhibitions.</p>
                      <div className="mt-auto">
                        <span className="badge bg-dark mb-2">3D Art</span>
                        <a href="#" className="btn btn-outline-primary btn-sm w-100">
                          View Details <i className="bi bi-arrow-up-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Resources */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-1 text-primary">Curated Resources</h2>
              <p className="text-muted mb-0">Tools, guides, and inspiration for your creative journey.</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-bookmark text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Top 10 Online Art Marketplaces</h5>
                      <a href="#" className="btn btn-outline-primary btn-sm">Read more <i className="bi bi-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-bookmark text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Beginner's Guide to Art Prints</h5>
                      <a href="#" className="btn btn-outline-primary btn-sm">Read more <i className="bi bi-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-bookmark text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Understanding Color Theory for Digital Artists</h5>
                      <a href="#" className="btn btn-outline-primary btn-sm">Read more <i className="bi bi-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-bookmark text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Legal Checklist for Freelance Artists</h5>
                      <a href="#" className="btn btn-outline-primary btn-sm">Read more <i className="bi bi-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Insights */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-1 text-primary">Marketing Insights</h2>
              <p className="text-muted mb-0">Tips to help your art reach a wider audience.</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-3">💡</div>
                      <h5 className="card-title">Leveraging Instagram for Art Sales</h5>
                      <p className="card-text text-muted">Discover strategies to showcase your art effectively on social media and reach potential buyers.</p>
                      <a href="#" className="btn btn-outline-primary btn-sm">
                        Read More <i className="bi bi-arrow-left ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-3">💡</div>
                      <h5 className="card-title">The Power of Email Newsletters for Artists</h5>
                      <p className="card-text text-muted">Build a loyal audience and drive sales with compelling email campaigns.</p>
                      <a href="#" className="btn btn-outline-primary btn-sm">
                        Read More <i className="bi bi-arrow-left ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-3">💡</div>
                      <h5 className="card-title">SEO Basics for Artist Websites</h5>
                      <p className="card-text text-muted">Improve your visibility on search engines so collectors can easily find your work.</p>
                      <a href="#" className="btn btn-outline-primary btn-sm">
                        Read More <i className="bi bi-arrow-left ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          {/* Recent Notifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="h5 mb-1 text-primary">Recent Notifications</h3>
              <p className="text-muted mb-0">Stay updated on community activity.</p>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-bell text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">New reply in 'Tips for selling art online in 2024'.</p>
                    <small className="text-muted">5 minutes ago</small>
                  </div>
                </div>

                <div className="list-group-item d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-bell text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">Your collaboration request for 'Illustrator needed' received a new inquiry.</p>
                    <small className="text-muted">30 minutes ago</small>
                  </div>
                </div>

                <div className="list-group-item d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-bell text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">ArtfulCreator mentioned you in a discussion.</p>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                </div>

                <div className="list-group-item d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-bell text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">Community event 'Virtual Studio Tour' starts in 2 hours!</p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
