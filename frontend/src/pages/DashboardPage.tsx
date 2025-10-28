import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { artistAPI, artworkAPI, getUser } from '../services/api.service';

import '../styles/App.css';


 

interface Stats {

 totalArtworks: number;

 totalSales: number;

 totalRevenue: number;

 activeArtists: number;

 happyBuyers: number;

}


 

interface Activity {

 icon: string;

 text: string;

 time: string;

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

 const [activities] = useState<Activity[]>([

   { icon: '🎨', text: "Artist Emily Chen uploaded 'Cityscape Dreams'.", time: '2 hours ago' },

   { icon: '🛒', text: "A buyer purchased 'Abstract Harmony' by David Lee.", time: 'Yesterday' },

   { icon: '💬', text: "Sarah Miller posted in 'Marketing Tips for Artists'.", time: '2 days ago' },

   { icon: '🎉', text: 'Welcome new artist Alex Johnson to Arthub!', time: '3 days ago' }

 ]);


 

 useEffect(() => {

   fetchDashboardData();

 }, []);


 

 const fetchDashboardData = async () => {

   try {

     setLoading(true);

     

     // Fetch artist stats if user is an artist

     if (currentUser?.isArtist) {

       const artistStats = await artistAPI.getStats();

       const inventory = await artistAPI.getInventory();

       

       setStats({

         totalArtworks: inventory.data.artworks.length,

         totalSales: artistStats.data.totalSales || 0,

         totalRevenue: artistStats.data.totalRevenue || 0,

         activeArtists: 350,

         happyBuyers: 890

       });

     } else {

       // Default stats for buyers

       setStats({

         totalArtworks: 1200,

         totalSales: 0,

         totalRevenue: 78500,

         activeArtists: 350,

         happyBuyers: 890

       });

     }

   } catch (error) {

     console.error('Error fetching dashboard data:', error);

   } finally {

     setLoading(false);

   }

 };


 

 return (

   <>

     <div className="dashboard-page">

       <div className="dashboard-container">

         {/* Hero Section */}

         <section className="dashboard-hero">

           <div className="hero-content-dashboard">

             <h1>Discover, Create, Connect: Your Art Journey Starts Here.</h1>

             <p>

               Arthub connects talented artists with eager buyers. Manage your art, 

               track sales, and engage with a vibrant community. Your dashboard provides 

               a quick overview of everything you need.

             </p>

             <button className="btn btn-primary" onClick={() => navigate('/upload')}>

               Start Creating Now

             </button>

           </div>

           <div className="hero-image-dashboard">

             <div className="hero-illustration">

               <div className="illustration-workspace">

                 <div className="workspace-desk"></div>

                 <div className="workspace-items">

                   <div className="item-canvas canvas-1"></div>

                   <div className="item-canvas canvas-2"></div>

                   <div className="item-canvas canvas-3"></div>

                   <div className="item-plant"></div>

                   <div className="item-chair"></div>

                 </div>

               </div>

             </div>

           </div>

         </section>


 

         {/* Platform Overview */}

         <section className="platform-overview">

           <h2>Your Platform Overview</h2>

           <div className="stats-grid">

             <div className="stat-card">

               <div className="stat-icon">🎨</div>

               <div className="stat-content">

                 <h3>Total Artworks</h3>

                 <div className="stat-value">{loading ? '...' : stats.totalArtworks.toLocaleString()}+</div>

                 <p className="stat-change">Up 12% from last month</p>

               </div>

             </div>

             

             <div className="stat-card">

               <div className="stat-icon">💰</div>

               <div className="stat-content">

                 <h3>Total Sales</h3>

                 <div className="stat-value">${loading ? '...' : stats.totalRevenue.toLocaleString()}</div>

                 <p className="stat-change">Up 8% from last month</p>

               </div>

             </div>

             

             <div className="stat-card">

               <div className="stat-icon">👨‍🎨</div>

               <div className="stat-content">

                 <h3>Active Artists</h3>

                 <div className="stat-value">{stats.activeArtists}</div>

                 <p className="stat-change">5 new artists this week</p>

               </div>

             </div>

             

             <div className="stat-card">

               <div className="stat-icon">😊</div>

               <div className="stat-content">

                 <h3>Happy Buyers</h3>

                 <div className="stat-value">{stats.happyBuyers}</div>

                 <p className="stat-change">Satisfied customers</p>

               </div>

             </div>

           </div>

         </section>


 

         {/* Quick Access Features */}

         <section className="quick-access">

           <h2>Quick Access to Features</h2>

           <div className="features-grid-dashboard">

             <div className="feature-card-dashboard" onClick={() => navigate('/upload')}>

               <div className="feature-icon-dashboard">☁️</div>

               <h3>Upload New Artwork</h3>

               <p>Showcase your latest creations to a global audience.</p>

             </div>

             

             <div className="feature-card-dashboard" onClick={() => navigate('/artist-profile')}>

               <div className="feature-icon-dashboard">👤</div>

               <h3>Manage Your Profile</h3>

               <p>Update your artist bio, portfolio, and contact details.</p>

             </div>

             

             <div className="feature-card-dashboard" onClick={() => navigate('/inventory')}>

               <div className="feature-icon-dashboard">📋</div>

               <h3>Inventory & Sales</h3>

               <p>Track your listings, sales, and artwork availability.</p>

             </div>

             

             <div className="feature-card-dashboard" onClick={() => navigate('/community')}>

               <div className="feature-icon-dashboard">👥</div>

               <h3>Explore Community</h3>

               <p>Connect with fellow artists, share insights, and collaborate.</p>

             </div>

             

             <div className="feature-card-dashboard" onClick={() => navigate('/search')}>

               <div className="feature-icon-dashboard">🔍</div>

               <h3>Discover New Art</h3>

               <p>Browse a curated selection of unique artworks from various artists.</p>

             </div>

             

             <div className="feature-card-dashboard" onClick={() => navigate('/favorites')}>

               <div className="feature-icon-dashboard">❤️</div>

               <h3>Your Favorites</h3>

               <p>Quickly access artworks you've saved or wish to purchase later.</p>

             </div>

           </div>

         </section>


 

         {/* Recent Activity */}

         <section className="recent-activity">

           <h2>Recent Activity</h2>

           <div className="activity-list">

             {activities.map((activity, index) => (

               <div key={index} className="activity-item">

                 <div className="activity-icon">{activity.icon}</div>

                 <div className="activity-content">

                   <p className="activity-text">{activity.text}</p>

                   <p className="activity-time">{activity.time}</p>

                 </div>

               </div>

             ))}

           </div>

         </section>


 

         {/* CTA Section */}

         <section className="dashboard-cta">

           <div className="cta-content-dashboard">

             <h2>Ready to Explore More Unique Artworks?</h2>

             <p>

               Dive into our extensive collection from artists around the globe. 

               Find your next masterpiece today.

             </p>

             <button className="btn btn-light" onClick={() => navigate('/search')}>

               Browse Artworks

             </button>

           </div>

         </section>

       </div>

     </div>

   </>

 );

};


 

export default DashboardPage;