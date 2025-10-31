import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { artistAPI, getUser } from '../services/api.service';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles/App.css';


 

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

 const [activities] = useState<Activity[]>([

   { iconClass: 'bi-palette-fill', text: "Artist Emily Chen uploaded 'Cityscape Dreams'.", time: '2 hours ago' },

   { iconClass: 'bi-cart-check-fill', text: "A buyer purchased 'Abstract Harmony' by David Lee.", time: 'Yesterday' },

   { iconClass: 'bi-chat-dots-fill', text: "Sarah Miller posted in 'Marketing Tips for Artists'.", time: '2 days ago' },

   { iconClass: 'bi-balloon-heart-fill', text: 'Welcome new artist Alex Johnson to Arthub!', time: '3 days ago' }

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

    <div className="dashboard-page py-4 py-md-5">

      <div className="dashboard-container container-fluid px-3 px-md-4 px-lg-5">

        {/* Hero Section */}

        <section className="dashboard-hero mb-4 mb-md-5">

          <div className="hero-content-dashboard row g-4">

             <h1>Discover, Create, Connect: Your Art Journey Starts Here.</h1>

             <p>

               Arthub connects talented artists with eager buyers. Manage your art, 

               track sales, and engage with a vibrant community. Your dashboard provides 

               a quick overview of everything you need.

             </p>

            <button className="btn btn-primary" type="button" onClick={() => navigate('/upload')}>

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

         <section className="platform-overview mb-4 mb-md-5">

           <h2 className="mb-4 mb-md-5">Your Platform Overview</h2>

          <div className="stats-grid row gx-3 gx-md-4 gx-lg-5 gy-4">

            <div className="stat-card col-12 col-sm-6 col-md-6 col-lg-3 mb-3 mb-lg-0 d-flex justify-content-center">

               <div className="stat-icon"><i className="bi bi-palette-fill"></i></div>

               <div className="stat-content">

                 <h3>Total Artworks</h3>

                 <div className="stat-value">{loading ? '...' : stats.totalArtworks.toLocaleString()}+</div>

                 <p className="stat-change">Up 12% from last month</p>

               </div>

            </div>

            

             <div className="stat-card col-12 col-sm-6 col-md-6 col-lg-3 mb-3 mb-lg-0 d-flex justify-content-center">

               <div className="stat-icon"><i className="bi bi-cash-stack"></i></div>

               <div className="stat-content">

                 <h3>Total Sales</h3>

                 <div className="stat-value">${loading ? '...' : stats.totalRevenue.toLocaleString()}</div>

                 <p className="stat-change">Up 8% from last month</p>

               </div>

            </div>

            

            <div className="stat-card col-12 col-sm-6 col-md-6 col-lg-3 mb-3 mb-lg-0 d-flex justify-content-center">

              <div className="stat-icon"><i className="bi bi-person-badge-fill"></i></div>

               <div className="stat-content">

                 <h3>Active Artists</h3>

                 <div className="stat-value">{stats.activeArtists}</div>

                 <p className="stat-change">5 new artists this week</p>

               </div>

            </div>

            

            <div className="stat-card col-12 col-sm-6 col-md-6 col-lg-3 mb-3 mb-lg-0 d-flex justify-content-center">

              <div className="stat-icon"><i className="bi bi-emoji-smile-fill"></i></div>

               <div className="stat-content">

                 <h3>Happy Buyers</h3>

                 <div className="stat-value">{stats.happyBuyers}</div>

                 <p className="stat-change">Satisfied customers</p>

               </div>

             </div>

           </div>

         </section>


 

         {/* Quick Access Features */}

         <section className="quick-access mb-4 mb-md-5">

           <h2 className="mb-4 mb-md-5">Quick Access to Features</h2>

          <div className="features-grid-dashboard row gx-4 gx-md-5 gx-lg-6 gy-4">

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/upload')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-cloud-upload-fill"></i></div>

               <h3>Upload New Artwork</h3>

               <p>Showcase your latest creations to a global audience.</p>

            </div>

            

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/artist-profile')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-person-circle"></i></div>

               <h3>Manage Your Profile</h3>

               <p>Update your artist bio, portfolio, and contact details.</p>

            </div>

            

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-clipboard-check-fill"></i></div>

               <h3>Inventory & Sales</h3>

               <p>Track your listings, sales, and artwork availability.</p>

            </div>

            

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/community')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-people-fill"></i></div>

               <h3>Explore Community</h3>

               <p>Connect with fellow artists, share insights, and collaborate.</p>

            </div>

            

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/search')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-search"></i></div>

               <h3>Discover New Art</h3>

               <p>Browse a curated selection of unique artworks from various artists.</p>

            </div>

            

            <div className="feature-card-dashboard col-12 col-sm-6 col-md-4 col-lg-3" onClick={() => navigate('/favorites')} style={{ cursor: 'pointer' }}>

               <div className="feature-icon-dashboard"><i className="bi bi-heart-fill"></i></div>

               <h3>Your Favorites</h3>

               <p>Quickly access artworks you've saved or wish to purchase later.</p>

             </div>

           </div>

         </section>


 

         {/* Recent Activity */}

         <section className="recent-activity mb-4 mb-md-5">

           <h2 className="mb-4 mb-md-5">Recent Activity</h2>

          <div className="activity-list list-group gap-3">

            {activities.map((activity, index) => (

              <div key={index} className="activity-item list-group-item">

                 <div className="activity-icon"><i className={`bi ${activity.iconClass}`}></i></div>

                 <div className="activity-content">

                   <p className="activity-text">{activity.text}</p>

                   <p className="activity-time">{activity.time}</p>

                 </div>

               </div>

             ))}

           </div>

         </section>


 

         {/* CTA Section */}

         <section className="dashboard-cta my-4 my-md-5">

           <div className="cta-content-dashboard">

             <h2>Ready to Explore More Unique Artworks?</h2>

             <p>

               Dive into our extensive collection from artists around the globe. 

               Find your next masterpiece today.

             </p>

            <button className="btn btn-light" type="button" onClick={() => navigate('/search')}>

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