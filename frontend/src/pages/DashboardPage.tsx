import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, artworkAPI, getUser } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
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
   <div className="container-fluid py-4">
     {/* Hero Section */}
     <section className="row mb-5">
       <div className="col-lg-8">
         <div className="text-center text-lg-start">
           <h1 className="display-4 text-primary mb-3">Discover, Create, Connect: Your Art Journey Starts Here.</h1>
           <p className="lead text-muted mb-4">
             Arthub connects talented artists with eager buyers. Manage your art, 
             track sales, and engage with a vibrant community. Your dashboard provides 
             a quick overview of everything you need.
           </p>
           <button className="btn btn-primary btn-lg" onClick={() => navigate('/upload')}>
             <i className="bi bi-upload me-2"></i>
             Start Creating Now
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
     </section>


 

     {/* Platform Overview */}
     <section className="row mb-5">
       <div className="col-12">
         <h2 className="h3 text-primary mb-4">Your Platform Overview</h2>
         <div className="row g-4">
           <div className="col-md-6 col-lg-3">
             <div className="card text-center h-100">
               <div className="card-body">
                 <div className="fs-1 mb-3">🎨</div>
                 <h5 className="card-title">Total Artworks</h5>
                 <div className="h4 text-primary mb-2">{loading ? '...' : stats.totalArtworks.toLocaleString()}+</div>
                 <p className="text-muted small mb-0">Up 12% from last month</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-3">
             <div className="card text-center h-100">
               <div className="card-body">
                 <div className="fs-1 mb-3">💰</div>
                 <h5 className="card-title">Total Sales</h5>
                 <div className="h4 text-success mb-2">${loading ? '...' : stats.totalRevenue.toLocaleString()}</div>
                 <p className="text-muted small mb-0">Up 8% from last month</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-3">
             <div className="card text-center h-100">
               <div className="card-body">
                 <div className="fs-1 mb-3">👨‍🎨</div>
                 <h5 className="card-title">Active Artists</h5>
                 <div className="h4 text-info mb-2">{stats.activeArtists}</div>
                 <p className="text-muted small mb-0">5 new artists this week</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-3">
             <div className="card text-center h-100">
               <div className="card-body">
                 <div className="fs-1 mb-3">😊</div>
                 <h5 className="card-title">Happy Buyers</h5>
                 <div className="h4 text-warning mb-2">{stats.happyBuyers}</div>
                 <p className="text-muted small mb-0">Satisfied customers</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>


 

     {/* Quick Access Features */}
     <section className="row mb-5">
       <div className="col-12">
         <h2 className="h3 text-primary mb-4">Quick Access to Features</h2>
         <div className="row g-4">
           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/upload')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">☁️</div>
                 <h5 className="card-title">Upload New Artwork</h5>
                 <p className="card-text text-muted">Showcase your latest creations to a global audience.</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/artist-profile')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">👤</div>
                 <h5 className="card-title">Manage Your Profile</h5>
                 <p className="card-text text-muted">Update your artist bio, portfolio, and contact details.</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/inventory')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">📋</div>
                 <h5 className="card-title">Inventory & Sales</h5>
                 <p className="card-text text-muted">Track your listings, sales, and artwork availability.</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/community')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">👥</div>
                 <h5 className="card-title">Explore Community</h5>
                 <p className="card-text text-muted">Connect with fellow artists, share insights, and collaborate.</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/search')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">🔍</div>
                 <h5 className="card-title">Discover New Art</h5>
                 <p className="card-text text-muted">Browse a curated selection of unique artworks from various artists.</p>
               </div>
             </div>
           </div>

           <div className="col-md-6 col-lg-4">
             <div className="card h-100 text-center" style={{cursor: 'pointer'}} onClick={() => navigate('/favorites')}>
               <div className="card-body">
                 <div className="fs-1 mb-3">❤️</div>
                 <h5 className="card-title">Your Favorites</h5>
                 <p className="card-text text-muted">Quickly access artworks you've saved or wish to purchase later.</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>


 

     {/* Recent Activity */}
     <section className="row mb-5">
       <div className="col-12">
         <h2 className="h3 text-primary mb-4">Recent Activity</h2>
         <div className="card">
           <div className="card-body">
             <div className="list-group list-group-flush">
               {activities.map((activity, index) => (
                 <div key={index} className="list-group-item d-flex align-items-start">
                   <div className="flex-shrink-0 me-3">
                     <div className="fs-4">{activity.icon}</div>
                   </div>
                   <div className="flex-grow-1">
                     <p className="mb-1">{activity.text}</p>
                     <small className="text-muted">{activity.time}</small>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     </section>


 

     {/* CTA Section */}
     <section className="row">
       <div className="col-12">
         <div className="card bg-primary text-white text-center">
           <div className="card-body py-5">
             <h2 className="h3 mb-3">Ready to Explore More Unique Artworks?</h2>
             <p className="lead mb-4">
               Dive into our extensive collection from artists around the globe. 
               Find your next masterpiece today.
             </p>
             <button className="btn btn-light btn-lg" onClick={() => navigate('/search')}>
               <i className="bi bi-search me-2"></i>
               Browse Artworks
             </button>
           </div>
         </div>
       </div>
     </section>
   </div>
 );

};


 

export default DashboardPage;