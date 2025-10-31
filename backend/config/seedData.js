// seed/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');
const ArtistProfile = require('../models/ArtistProfile');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Community = require('../models/Community');
const Analytics = require('../models/Analytics');
const Notification = require('../models/Notification');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arthub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      ArtistProfile.deleteMany(),
      Artwork.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Community.deleteMany(),
      Analytics.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('🧹 Cleared existing data');

    // Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const users = await User.insertMany([
      { name: 'Alice Johnson',     email: 'alice@example.com',     password: hashedPassword, profilePicture: '/assets/images/pexels-shvetsa-3683209.jpg' },
      { name: 'Bob Smith',         email: 'bob@example.com',       password: hashedPassword, profilePicture: '/assets/images/close-up-portrait-curly-handsome-european-male.jpg' },
      { name: 'Clara Wilson',      email: 'clara@example.com',     password: hashedPassword, profilePicture: '/assets/images/images (1).jpeg' },
      { name: 'David Brown',       email: 'david@example.com',     password: hashedPassword, profilePicture: '/assets/images/smiling-caucasian-young-guy-wearing-pink-shirt-isolated-white-background.jpg' },
      { name: 'Ella Davis',        email: 'ella@example.com',      password: hashedPassword, profilePicture: '/assets/images/images (3).jpeg' },
      { name: 'Frank Miller',      email: 'frank@example.com',     password: hashedPassword, profilePicture: '/assets/images/young-bearded-man-black-shirt-looking-aside-confused.jpg' },
      { name: 'Grace Lee',         email: 'grace@example.com',     password: hashedPassword, profilePicture: '/assets/images/images.jpeg' },
      { name: 'Hank Green',        email: 'hank@example.com',      password: hashedPassword, profilePicture: '/assets/images/pexels-expect-best-79873-707265.jpg' },
      { name: 'Special User',      email: 'user@gmail.com',        password: hashedPassword, profilePicture: '/assets/images/pexels-rakicevic-nenad-233369-1262302.jpg' }
    ]);
    console.log('👥 Users inserted');

    const specialUser = users.find(u => u.email === 'user@gmail.com');

    // Artist Profiles
    const artistProfiles = await ArtistProfile.insertMany([
      {
        userId: users[0]._id,
        bio: 'Contemporary painter inspired by urban life.',
        portfolio: 'https://behance.net/aliceart',
        socialMediaLinks: { instagram: 'https://instagram.com/aliceart' },
        profilePicture: users[0].profilePicture,
        isVerified: true,
        rating: 4.8,
        totalSales: 5,
        totalRevenue: 2500
      },
      {
        userId: users[1]._id,
        bio: 'Sculptor focusing on modern minimalism.',
        portfolio: 'https://bobsculpt.com',
        socialMediaLinks: { instagram: 'https://instagram.com/bobsculpt' },
        profilePicture: users[1].profilePicture,
        isVerified: true,
        rating: 4.6,
        totalSales: 3,
        totalRevenue: 3600
      },
      {
        userId: users[2]._id,
        bio: 'Digital illustrator and concept artist.',
        portfolio: 'https://dribbble.com/clarawilson',
        socialMediaLinks: { instagram: 'https://instagram.com/clarawilson' },
        profilePicture: users[2].profilePicture,
        isVerified: false,
        rating: 4.5,
        totalSales: 2,
        totalRevenue: 700
      },
      {
        userId: users[3]._id,
        bio: 'Photographer capturing human emotions.',
        portfolio: 'https://photographybydavid.com',
        socialMediaLinks: { instagram: 'https://instagram.com/davidphoto' },
        profilePicture: users[3].profilePicture,
        isVerified: true,
        rating: 4.9,
        totalSales: 8,
        totalRevenue: 6400
      },
      {
        userId: users[4]._id,
        bio: 'Mixed-media artist exploring textures and forms.',
        portfolio: 'https://ellamediaart.com',
        socialMediaLinks: { instagram: 'https://instagram.com/ellamedia' },
        profilePicture: users[4].profilePicture,
        isVerified: false,
        rating: 4.3,
        totalSales: 1,
        totalRevenue: 400
      },
      {
        userId: specialUser._id,
        bio: 'All-round creator: painting, digital art & sculpture.',
        portfolio: 'https://specialuserart.com',
        socialMediaLinks: { instagram: 'https://instagram.com/specialuserart' },
        profilePicture: specialUser.profilePicture,
        isVerified: true,
        rating: 4.7,
        totalSales: 6,
        totalRevenue: 4200
      }
    ]);
    console.log('🎨 Artist profiles inserted');

    // Artworks
    const artworks = await Artwork.insertMany([
      {
        artistId: users[0]._1?._id || users[0]._id,
        title: 'City Reflections',
        description: 'Acrylic painting depicting the glow of city lights on a rainy night.',
        price: 500,
        images: [{ url: '/assets/images/pexels-zaksheuskaya-709412-1561020.jpg', isPrimary: true }],
        medium: 'Acrylic',
        style: 'Contemporary',
        tags: ['city','rain','urban']
      },
      {
        artistId: users[1]._id,
        title: 'Silent Stone',
        description: 'Abstract sculpture carved from granite, symbolizing stillness.',
        price: 1200,
        images: [{ url: '/assets/images/pexels-expect-best-79873-707265.jpg', isPrimary: true }],
        medium: 'Sculpture',
        style: 'Minimalism',
        tags: ['sculpture','stone','abstract']
      },
      {
        artistId: users[2]._id,
        title: 'Dreamscape',
        description: 'Digital surreal art exploring imagination and dreams.',
        price: 350,
        images: [{ url: '/assets/images/pexels-rakicevic-nenad-233369-1262302.jpg', isPrimary: true }],
        medium: 'Digital Art',
        style: 'Surrealism',
        tags: ['digital','dream','fantasy']
      },
      {
        artistId: users[0]._id,
        title: 'Sunset Melody',
        description: 'Oil on canvas capturing the symphony of colors during sunset.',
        price: 750,
        images: [{ url: '/assets/images/images.jpeg', isPrimary: true }],
        medium: 'Oil on Canvas',
        style: 'Impressionism',
        tags: ['sunset','landscape','color']
      },
      {
        artistId: users[3]._id,
        title: 'Portrait of Silence',
        description: 'Photography print capturing a moment of deep thought.',
        price: 300,
        images: [{ url: '/assets/images/images (1).jpeg', isPrimary: true }],
        medium: 'Photography',
        style: 'Realism',
        tags: ['portrait','thought','human']
      },
      {
        artistId: users[4]._id,
        title: 'Textures of Time',
        description: 'Mixed media piece reflecting layers of memory and material.',
        price: 600,
        images: [{ url: '/assets/images/images (3).jpeg', isPrimary: true }],
        medium: 'Mixed Media',
        style: 'Expressionism',
        tags: ['texture','memory','mixed media']
      },
      {
        artistId: users[1]._id,
        title: 'Monochrome Silence',
        description: 'Charcoal on paper drawing emphasizing shape and void.',
        price: 400,
        images: [{ url: '/assets/images/pexels-shvetsa-3683209.jpg', isPrimary: true }],
        medium: 'Charcoal',
        style: 'Minimalism',
        tags: ['charcoal','paper','monochrome']
      },
      {
        artistId: users[2]._id,
        title: 'Urban Pop',
        description: 'Pop-art digital illustration based on city icons.',
        price: 450,
        images: [{ url: '/assets/images/close-up-portrait-curly-handsome-european-male.jpg', isPrimary: true }],
        medium: 'Digital Art',
        style: 'Pop Art',
        tags: ['pop art','city','illustration']
      },
      // Special user artworks (5 entries)
      {
        artistId: specialUser._id,
        title: 'Special Artwork 1',
        description: 'Oil painting by Special User exploring light and shadow.',
        price: 800,
        images: [{ url: '/assets/images/smiling-caucasian-young-guy-wearing-pink-shirt-isolated-white-background.jpg', isPrimary: true }],
        medium: 'Oil on Canvas',
        style: 'Contemporary',
        tags: ['special','light','shadow']
      },
      {
        artistId: specialUser._id,
        title: 'Special Artwork 2',
        description: 'Digital art piece from Special User featuring abstract geometry.',
        price: 650,
        images: [{ url: '/assets/images/young-bearded-man-black-shirt-looking-aside-confused.jpg', isPrimary: true }],
        medium: 'Digital Art',
        style: 'Pop Art',
        tags: ['digital','abstract','geometry']
      },
      {
        artistId: specialUser._id,
        title: 'Special Artwork 3',
        description: 'Sculpture combining recycled materials – by Special User.',
        price: 900,
        images: [{ url: '/assets/images/pexels-zaksheuskaya-709412-1561020.jpg', isPrimary: true }],
        medium: 'Sculpture',
        style: 'Modern',
        tags: ['sculpture','recycled','modern']
      },
      {
        artistId: specialUser._id,
        title: 'Special Artwork 4',
        description: 'Mixed media collage by Special User about time and memory.',
        price: 700,
        images: [{ url: '/assets/images/pexels-expect-best-79873-707265.jpg', isPrimary: true }],
        medium: 'Mixed Media',
        style: 'Expressionism',
        tags: ['collage','memory','mixed']
      },
      {
        artistId: specialUser._id,
        title: 'Special Artwork 5',
        description: 'Photography print by Special User of urban textures.',
        price: 550,
        images: [{ url: '/assets/images/pexels-rakicevic-nenad-233369-1262302.jpg', isPrimary: true }],
        medium: 'Photography',
        style: 'Contemporary',
        tags: ['photography','urban','texture']
      }
    ]);
    console.log('🖼️ Artworks inserted');

    // Orders
    const orders = await Order.insertMany([
      {
        buyerId: users[3]._id,
        artworkId: artworks[0]._id,
        artistId: artworks[0].artistId,
        orderNumber: 'ORD-001',
        price: artworks[0].price,
        shippingAddress: { street: '12 Baker St', city: 'London', state: 'London', country: 'UK', zipCode: 'NW16XE' },
        paymentMethod: 'Credit Card',
        paymentStatus: 'completed',
        orderStatus: 'delivered'
      },
      {
        buyerId: users[4]._id,
        artworkId: artworks[1]._id,
        artistId: artworks[1].artistId,
        orderNumber: 'ORD-002',
        price: artworks[1].price,
        shippingAddress: { street: '221B Elm St', city: 'New York', state: 'NY', country: 'USA', zipCode: '10001' },
        paymentMethod: 'PayPal',
        paymentStatus: 'completed',
        orderStatus: 'shipped'
      },
      {
        buyerId: users[5]._id,
        artworkId: artworks[2]._id,
        artistId: artworks[2].artistId,
        orderNumber: 'ORD-003',
        price: artworks[2].price,
        shippingAddress: { street: '5 Main Rd', city: 'Sydney', state: 'NSW', country: 'Australia', zipCode: '2000' },
        paymentMethod: 'Debit Card',
        paymentStatus: 'completed',
        orderStatus: 'processing'
      },
      {
        buyerId: users[6]._id,
        artworkId: artworks[3]._id,
        artistId: artworks[3].artistId,
        orderNumber: 'ORD-004',
        price: artworks[3].price,
        shippingAddress: { street: '77 Hill St', city: 'Toronto', state: 'ON', country: 'Canada', zipCode: 'M5S2E8' },
        paymentMethod: 'UPI',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      },
      {
        buyerId: users[7]._id,
        artworkId: artworks[4]._id,
        artistId: artworks[4].artistId,
        orderNumber: 'ORD-005',
        price: artworks[4].price,
        shippingAddress: { street: '10 Park Ave', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400001' },
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'completed',
        orderStatus: 'confirmed'
      },
      // Orders for special user as buyer
      {
        buyerId: specialUser._id,
        artworkId: artworks[8]._id,
        artistId: artworks[8].artistId,
        orderNumber: 'ORD-1001',
        price: artworks[8].price,
        shippingAddress: { street: '123 Special Ave', city: 'Delhi', state: 'DL', country: 'India', zipCode: '110001' },
        paymentMethod: 'UPI',
        paymentStatus: 'completed',
        orderStatus: 'delivered'
      },
      {
        buyerId: specialUser._id,
        artworkId: artworks[9]._id,
        artistId: artworks[9].artistId,
        orderNumber: 'ORD-1002',
        price: artworks[9].price,
        shippingAddress: { street: '45 Creative Blvd', city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560001' },
        paymentMethod: 'Credit Card',
        paymentStatus: 'completed',
        orderStatus: 'shipped'
      },
      {
        buyerId: specialUser._id,
        artworkId: artworks[0]._id,
        artistId: artworks[0].artistId,
        orderNumber: 'ORD-1003',
        price: artworks[0].price,
        shippingAddress: { street: '9 Art Lane', city: 'Pune', state: 'Maharashtra', country: 'India', zipCode: '411001' },
        paymentMethod: 'Debit Card',
        paymentStatus: 'completed',
        orderStatus: 'processing'
      }
    ]);
    console.log('📦 Orders inserted');

    // Reviews
    const reviews = await Review.insertMany([
      {
        artworkId: artworks[0]._id,
        buyerId: users[3]._id,
        orderId: orders[0]._id,
        rating: 5,
        comment: 'Absolutely stunning artwork!'
      },
      {
        artworkId: artworks[1]._id,
        buyerId: users[4]._id,
        orderId: orders[1]._id,
        rating: 4,
        comment: 'Great craftsmanship and detail.'
      },
      {
        artworkId: artworks[2]._id,
        buyerId: users[5]._id,
        orderId: orders[2]._id,
        rating: 3,
        comment: 'Interesting concept but colours weren’t exactly what I expected.'
      },
      // Reviews by special user as buyer
      {
        artworkId: artworks[8]._id,
        buyerId: specialUser._id,
        orderId: orders.find(o => o.orderNumber === 'ORD-1001')._id,
        rating: 4,
        comment: 'Loved the design and finish.'
      },
      {
        artworkId: artworks[9]._id,
        buyerId: specialUser._id,
        orderId: orders.find(o => o.orderNumber === 'ORD-1002')._id,
        rating: 5,
        comment: 'Excellent work, highly recommend!'
      }
    ]);
    console.log('⭐ Reviews inserted');

    // Community Connections
    const communities = await Community.insertMany([
      {
        senderId: users[0]._id,
        receiverId: users[1]._id,
        status: 'accepted',
        connectionType: 'collaboration',
        message: 'Let’s collaborate on an exhibition!'
      },
      {
        senderId: users[2]._id,
        receiverId: users[0]._id,
        status: 'pending',
        connectionType: 'mentorship',
        message: 'Would love to learn from you!'
      },
      {
        senderId: users[3]._id,
        receiverId: users[4]._id,
        status: 'accepted',
        connectionType: 'networking',
        message: 'Hello Ella, nice to connect.'
      },
      {
        senderId: users[5]._id,
        receiverId: users[6]._id,
        status: 'rejected',
        connectionType: 'general',
        message: 'Thanks but I prefer not right now.'
      },
      // Connections involving special user
      {
        senderId: specialUser._id,
        receiverId: users[0]._id,
        status: 'accepted',
        connectionType: 'collaboration',
        message: 'Let’s work together on a project!'
      },
      {
        senderId: users[1]._id,
        receiverId: specialUser._id,
        status: 'pending',
        connectionType: 'mentorship',
        message: 'Would love to learn from you.'
      }
    ]);
    console.log('🤝 Community connections inserted');

    // Analytics
    const analytics = await Analytics.insertMany([
      { artistId: users[0]._id, artworkId: artworks[0]._id, eventType: 'view', userId: users[3]._id, metadata: { ip: '192.168.0.1' } },
      { artistId: users[1]._id, artworkId: artworks[1]._id, eventType: 'like', userId: users[4]._id, metadata: { device: 'mobile' } },
      { artistId: users[2]._id, artworkId: artworks[2]._id, eventType: 'share', userId: users[5]._id, metadata: { platform: 'twitter' } },
      { artistId: users[0]._id, artworkId: artworks[3]._id, eventType: 'inquiry', userId: users[6]._id, metadata: { message: 'Is this framed?' } },
      { artistId: users[4]._id, artworkId: artworks[4]._id, eventType: 'purchase', userId: users[7]._id, metadata: { transactionRef: 'TX12345' } },
      // Analytics for special user
      { artistId: specialUser._id, artworkId: artworks[8]._id, eventType: 'view', userId: users[2]._id, metadata: { ip: '10.0.0.5' } },
      { artistId: specialUser._id, artworkId: artworks[8]._id, eventType: 'like', userId: users[3]._id, metadata: { device: 'desktop' } },
      { artistId: specialUser._id, artworkId: artworks[9]._id, eventType: 'share', userId: users[4]._id, metadata: { platform: 'instagram' } }
    ]);
    console.log('📊 Analytics inserted');

    // Notifications
    const notifications = await Notification.insertMany([
      {
        userId: users[0]._id,
        type: 'order',
        title: 'New Order Received',
        message: 'You have received a new order from David Brown.',
        link: '/orders/ORD-001'
      },
      {
        userId: users[3]._id,
        type: 'review',
        title: 'Review Submitted',
        message: 'Thanks for reviewing "City Reflections".',
        link: '/artworks/' + artworks[0]._id
      },
      {
        userId: users[1]._id,
        type: 'connection',
        title: 'Connection Request Accepted',
        message: 'Your collaboration connection with Alice Johnson is now active.',
        link: '/community'
      },
      {
        userId: users[2]._id,
        type: 'system',
        title: 'Profile Verified',
        message: 'Your artist profile has been verified.',
        link: '/artist/profile'
      },
      {
        userId: users[5]._id,
        type: 'message',
        title: 'New Message',
        message: 'Hank Green sent you a message.',
        link: '/messages'
      },
      // Notifications for special user
      {
        userId: specialUser._id,
        type: 'order',
        title: 'Your Order Delivered',
        message: 'Order ORD-1001 for your artwork has been delivered.',
        link: '/orders/ORD-1001'
      },
      {
        userId: specialUser._id,
        type: 'review',
        title: 'New Review Received',
        message: 'Someone reviewed your artwork “Special Artwork 1”.',
        link: '/artworks/' + artworks[8]._id
      },
      {
        userId: specialUser._id,
        type: 'system',
        title: 'Congrats on Your Milestone',
        message: 'You have completed 100 views on “Special Artwork 2”.',
        link: '/dashboard'
      }
    ]);
    console.log('🔔 Notifications inserted');

    console.log('✅ Dummy data successfully inserted!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
