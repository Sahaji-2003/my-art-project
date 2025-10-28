// ============================================
// src/pages/CommunityPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { communityAPI, type Post } from '../services/community';
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
    <div className="community-page">
      <div className="community-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome to the Arthub Community!</h1>
            <p>
              Connect, share, and grow with fellow artists and art enthusiasts. 
              Find collaborations, discover resources, and get marketing insights.
            </p>
            <button className="start-discussion-btn" onClick={handleStartDiscussion}>
              <span className="discussion-icon">💬</span>
              Start a Discussion
            </button>
          </div>
          <div className="welcome-illustration">
            <div className="artists-illustration">
              <div className="artist-figure artist-1">🎨</div>
              <div className="artist-figure artist-2">🖌️</div>
              <div className="artist-figure artist-3">📸</div>
              <div className="artist-figure artist-4">✏️</div>
              <div className="art-supplies">🖼️</div>
              <div className="art-supplies">🎭</div>
            </div>
          </div>
        </div>

        <div className="community-content">
          {/* Main Content */}
          <div className="main-content">
            {/* Latest Discussion Threads */}
            <div className="discussion-section">
              <div className="section-header">
                <h2>Latest Discussion Threads</h2>
                <p>Join the conversation on various topics.</p>
                <button className="new-thread-btn" onClick={handleNewThread}>
                  <span className="thread-icon">💬</span>
                  New Thread
                </button>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading discussions...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <div className="error-icon">⚠️</div>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="discussion-list">
                  <div className="discussion-item">
                    <div className="discussion-icon">💬</div>
                    <div className="discussion-content">
                      <h3>Tips for selling art online in 2024?</h3>
                      <div className="discussion-meta">
                        <span className="author">by ArtfulCreator</span>
                        <span className="time">2 hours ago</span>
                        <span className="category">Marketing</span>
                      </div>
                    </div>
                  </div>

                  <div className="discussion-item">
                    <div className="discussion-icon">💬</div>
                    <div className="discussion-content">
                      <h3>Best practices for protecting your artwork copyrights</h3>
                      <div className="discussion-meta">
                        <span className="author">by LegalCanvas</span>
                        <span className="time">yesterday</span>
                        <span className="category">Legal</span>
                      </div>
                    </div>
                  </div>

                  <div className="discussion-item">
                    <div className="discussion-icon">💬</div>
                    <div className="discussion-content">
                      <h3>Sharing experience with digital painting tools</h3>
                      <div className="discussion-meta">
                        <span className="author">by PixelBrush</span>
                        <span className="time">3 days ago</span>
                        <span className="category">Technique</span>
                      </div>
                    </div>
                  </div>

                  <div className="discussion-item">
                    <div className="discussion-icon">💬</div>
                    <div className="discussion-content">
                      <h3>Finding inspiration in everyday life</h3>
                      <div className="discussion-meta">
                        <span className="author">by DailyMuse</span>
                        <span className="time">1 week ago</span>
                        <span className="category">Inspiration</span>
                      </div>
                    </div>
                  </div>

                  <div className="discussion-item">
                    <div className="discussion-icon">💬</div>
                    <div className="discussion-content">
                      <h3>Feedback wanted: My latest abstract series</h3>
                      <div className="discussion-meta">
                        <span className="author">by ColorFlow</span>
                        <span className="time">2 weeks ago</span>
                        <span className="category">Critique</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collaboration Opportunities */}
            <div className="collaboration-section">
              <div className="section-header">
                <h2>Collaboration Opportunities</h2>
                <p>Find artists for your next project or offer your skills.</p>
              </div>

              <div className="collaboration-grid">
                <div className="collaboration-card">
                  <h3>Illustrator needed for children's book project</h3>
                  <p>Looking for a talented illustrator to bring whimsical characters to life in a children's book series.</p>
                  <div className="skill-tag">Illustration</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>

                <div className="collaboration-card">
                  <h3>Photographer for urban art documentation</h3>
                  <p>Seeking a photographer to capture mural art and street installations for a gallery exhibition.</p>
                  <div className="skill-tag">Photography</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>

                <div className="collaboration-card">
                  <h3>Graphic designer for art event branding</h3>
                  <p>Creative designer to help with logos, flyers, and digital marketing materials for upcoming art events.</p>
                  <div className="skill-tag">Graphic Design</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>

                <div className="collaboration-card">
                  <h3>Videographer for artist studio tour</h3>
                  <p>Create an engaging video tour of my studio space for social media and portfolio purposes.</p>
                  <div className="skill-tag">Videography</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>

                <div className="collaboration-card">
                  <h3>Web developer to build artist portfolio site</h3>
                  <p>Seeking a developer to build a modern, responsive portfolio website for showcasing artwork.</p>
                  <div className="skill-tag">Web Development</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>

                <div className="collaboration-card">
                  <h3>3D Artist for virtual gallery experience</h3>
                  <p>Collaborate on creating an immersive 3D virtual gallery space for online art exhibitions.</p>
                  <div className="skill-tag">3D Art</div>
                  <a href="#" className="view-details-link">
                    View Details
                    <span className="share-icon">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Curated Resources */}
            <div className="resources-section">
              <div className="section-header">
                <h2>Curated Resources</h2>
                <p>Tools, guides, and inspiration for your creative journey.</p>
              </div>

              <div className="resources-grid">
                <div className="resource-item">
                  <span className="resource-icon">🔖</span>
                  <h3>Top 10 Online Art Marketplaces</h3>
                  <a href="#" className="read-more-link">Read more →</a>
                </div>

                <div className="resource-item">
                  <span className="resource-icon">🔖</span>
                  <h3>Beginner's Guide to Art Prints</h3>
                  <a href="#" className="read-more-link">Read more →</a>
                </div>

                <div className="resource-item">
                  <span className="resource-icon">🔖</span>
                  <h3>Understanding Color Theory for Digital Artists</h3>
                  <a href="#" className="read-more-link">Read more →</a>
                </div>

                <div className="resource-item">
                  <span className="resource-icon">🔖</span>
                  <h3>Legal Checklist for Freelance Artists</h3>
                  <a href="#" className="read-more-link">Read more →</a>
                </div>
              </div>
            </div>

            {/* Marketing Insights */}
            <div className="marketing-section">
              <div className="section-header">
                <h2>Marketing Insights</h2>
                <p>Tips to help your art reach a wider audience.</p>
              </div>

              <div className="marketing-cards">
                <div className="marketing-card">
                  <div className="card-icon">💡</div>
                  <h3>Leveraging Instagram for Art Sales</h3>
                  <p>Discover strategies to showcase your art effectively on social media and reach potential buyers.</p>
                  <a href="#" className="read-more-link">
                    Read More
                    <span className="arrow-icon">←</span>
                  </a>
                </div>

                <div className="marketing-card">
                  <div className="card-icon">💡</div>
                  <h3>The Power of Email Newsletters for Artists</h3>
                  <p>Build a loyal audience and drive sales with compelling email campaigns.</p>
                  <a href="#" className="read-more-link">
                    Read More
                    <span className="arrow-icon">←</span>
                  </a>
                </div>

                <div className="marketing-card">
                  <div className="card-icon">💡</div>
                  <h3>SEO Basics for Artist Websites</h3>
                  <p>Improve your visibility on search engines so collectors can easily find your work.</p>
                  <a href="#" className="read-more-link">
                    Read More
                    <span className="arrow-icon">←</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar">
            {/* Recent Notifications */}
            <div className="notifications-section">
              <h3>Recent Notifications</h3>
              <p>Stay updated on community activity.</p>

              <div className="notifications-list">
                <div className="notification-item">
                  <span className="notification-icon">🔔</span>
                  <div className="notification-content">
                    <p>New reply in 'Tips for selling art online in 2024'.</p>
                    <span className="notification-time">5 minutes ago</span>
                  </div>
                </div>

                <div className="notification-item">
                  <span className="notification-icon">🔔</span>
                  <div className="notification-content">
                    <p>Your collaboration request for 'Illustrator needed' received a new inquiry.</p>
                    <span className="notification-time">30 minutes ago</span>
                  </div>
                </div>

                <div className="notification-item">
                  <span className="notification-icon">🔔</span>
                  <div className="notification-content">
                    <p>ArtfulCreator mentioned you in a discussion.</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>

                <div className="notification-item">
                  <span className="notification-icon">🔔</span>
                  <div className="notification-content">
                    <p>Community event 'Virtual Studio Tour' starts in 2 hours!</p>
                    <span className="notification-time">2 hours ago</span>
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
