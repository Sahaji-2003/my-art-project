import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, getUser, orderAPI as apiOrderAPI } from '../services/api.service';
import { artworkAPI } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Stats {
  totalArtworks: number;
  totalSales: number;
  totalRevenue: number;
  activeArtists: number;
  happyBuyers: number;
}

interface Activity {
  text: string;
  time: string;
  iconClass: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [stats, setStats] = useState<Stats>({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeArtists: 0,
    happyBuyers: 0
  });

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (currentUser?.isArtist) {
        // Fetch artist-specific data
        const [artistStats, inventory, orders] = await Promise.all([
          artistAPI.getStats().catch(() => ({ data: { totalRevenue: 0, totalSales: 0 } })),
          artistAPI.getInventory().catch(() => ({ data: { artworks: [] } })),
          apiOrderAPI.getArtistOrders().catch(() => ({ data: [] }))
        ]);

        const totalRevenue = orders.data?.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0) || 0;
        const totalSalesCount = orders.data?.length || 0;
        const artworks = inventory.data?.artworks || [];

        setStats({
          totalArtworks: artworks.length,
          totalSales: totalSalesCount,
          totalRevenue: artistStats.data?.totalRevenue || totalRevenue,
          activeArtists: 0, // Not available in current API
          happyBuyers: 0 // Not available in current API
        });

        // Build activities from recent artworks and orders
        const activityList: Activity[] = [];
        
        artworks.slice(0, 2).forEach((artwork: any) => {
          activityList.push({
            iconClass: 'bi-palette-fill',
            text: `New artwork "${artwork.title}" added to your collection.`,
            time: formatTimeAgo(new Date(artwork.createdAt || Date.now()))
          });
        });

        orders.data?.slice(0, 2).forEach((order: any) => {
          activityList.push({
            iconClass: 'bi-cart-check-fill',
            text: `Order #${order._id?.slice(-6)} for "${order.artwork?.title || 'Artwork'}" completed.`,
            time: formatTimeAgo(new Date(order.createdAt || Date.now()))
          });
        });

        setActivities(activityList);
      } else {
        // For buyers, fetch platform stats
        const [recentArtworks, userOrders] = await Promise.all([
          artworkAPI.searchArtworks({ limit: 12, page: 1 }).catch(() => ({ data: [], pagination: { total: 0 } })),
          apiOrderAPI.getUserOrders().catch(() => ({ data: [] }))
        ]);

        setStats({
          totalArtworks: recentArtworks.pagination?.total || recentArtworks.data?.length || 0,
          totalSales: userOrders.data?.length || 0,
          totalRevenue: userOrders.data?.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0) || 0,
          activeArtists: 0,
          happyBuyers: 0
        });

        // Build buyer activities
        const activityList: Activity[] = [];
        
        userOrders.data?.slice(0, 3).forEach((order: any) => {
          activityList.push({
            iconClass: 'bi-cart-check-fill',
            text: `Order for "${order.artwork?.title || 'Artwork'}" placed.`,
            time: formatTimeAgo(new Date(order.createdAt || Date.now()))
          });
        });

        setActivities(activityList);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4 py-md-5">
      {/* Hero Section */}
      <section className="bg-light rounded-4 p-4 p-md-5 mb-4 mb-md-5 border-0 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold mb-4">Discover, Create, Connect: Your Art Journey Starts Here.</h1>
            <p className="lead text-muted mb-4">
              Arthub connects talented artists with eager buyers. Manage your art,
              track sales, and engage with a vibrant community. Your dashboard provides
              a quick overview of everything you need.
            </p>
            {currentUser?.isArtist ? (
              <button 
                className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm fw-semibold" 
                type="button" 
                onClick={() => navigate('/upload')}
              >
                <i className="bi bi-cloud-upload-fill me-2"></i>
                Start Creating Now
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm fw-semibold" 
                type="button" 
                onClick={() => navigate('/search')}
              >
                <i className="bi bi-search me-2"></i>
                Explore Artworks
              </button>
            )}
          </div>
          <div className="col-lg-5 text-center">
            <div className="bg-gradient rounded-4 p-5 d-flex align-items-center justify-content-center" 
                 style={{ 
                   background: 'linear-gradient(135deg, #ffb6c1 0%, #ffd1dc 100%)',
                   minHeight: '300px',
                   height: '100%'
                 }}>
              <i className="bi bi-palette-fill display-1 text-white opacity-75"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="mb-4 mb-md-5">
        <h2 className="h2 fw-bold mb-4 mb-md-5">Your Platform Overview</h2>
        <div className="row g-3 g-md-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-palette-fill text-primary fs-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted small mb-1 fw-semibold">Total Artworks</p>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <h3 className="h4 fw-bold mb-0">{stats.totalArtworks.toLocaleString()}{stats.totalArtworks > 0 ? '+' : ''}</h3>
                    )}
                    <p className="text-success small mb-0 mt-1">Your collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-cash-stack text-success fs-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted small mb-1 fw-semibold">{currentUser?.isArtist ? 'Total Revenue' : 'Total Spent'}</p>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <h3 className="h4 fw-bold mb-0">${stats.totalRevenue.toLocaleString()}</h3>
                    )}
                    <p className="text-success small mb-0 mt-1">{currentUser?.isArtist ? 'Your earnings' : 'Your purchases'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-bag-check-fill text-info fs-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted small mb-1 fw-semibold">{currentUser?.isArtist ? 'Total Orders' : 'My Orders'}</p>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <h3 className="h4 fw-bold mb-0">{stats.totalSales.toLocaleString()}</h3>
                    )}
                    <p className="text-info small mb-0 mt-1">{currentUser?.isArtist ? 'Orders received' : 'Orders placed'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {stats.activeArtists > 0 && (
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-person-badge-fill text-warning fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-muted small mb-1 fw-semibold">Active Artists</p>
                      <h3 className="h4 fw-bold mb-0">{stats.activeArtists}</h3>
                      <p className="text-warning small mb-0 mt-1">Platform artists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access to Features */}
      <section className="mb-4 mb-md-5">
        <h2 className="h2 fw-bold mb-4 mb-md-5">Quick Access to Features</h2>
        <div className="row g-3 g-md-4">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/upload')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-cloud-upload-fill text-primary fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Upload New Artwork</h3>
                <p className="text-muted small mb-0">Showcase your latest creations to a global audience.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/artist-profile')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-person-circle text-info fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Manage Your Profile</h3>
                <p className="text-muted small mb-0">Update your artist bio, portfolio, and contact details.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/inventory')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-clipboard-check-fill text-success fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Inventory & Sales</h3>
                <p className="text-muted small mb-0">Track your listings, sales, and artwork availability.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/community')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-people-fill text-warning fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Explore Community</h3>
                <p className="text-muted small mb-0">Connect with fellow artists, share insights, and collaborate.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/search')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-search text-danger fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Discover New Art</h3>
                <p className="text-muted small mb-0">Browse a curated selection of unique artworks from various artists.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100 hover-shadow transition-all" 
              onClick={() => navigate('/search')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-secondary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-heart-fill text-secondary fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Favorite Artworks</h3>
                <p className="text-muted small mb-0">Quickly access artworks you've saved or wish to purchase later.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-4 mb-md-5">
        <h2 className="h2 fw-bold mb-4 mb-md-5">Recent Activity</h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading activities...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="row g-3">
            {activities.map((activity, index) => (
              <div key={index} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <i className={`bi ${activity.iconClass} text-primary fs-5`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-medium">{activity.text}</p>
                        <p className="text-muted small mb-0">
                          <i className="bi bi-clock me-1"></i>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center py-4">
            <i className="bi bi-info-circle me-2"></i>
            No recent activities to display.
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white rounded-4 p-5 mb-4 mb-md-5 border-0 shadow-sm">
        <div className="text-center">
          <h2 className="h2 fw-bold mb-3">Ready to Explore More Unique Artworks?</h2>
          <p className="lead mb-4 opacity-90">
            Dive into our extensive collection from artists around the globe.
            Find your next masterpiece today.
          </p>
          <button 
            className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm fw-semibold" 
            type="button" 
            onClick={() => navigate('/search')}
          >
            <i className="bi bi-search me-2"></i>
            Browse Artworks
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
