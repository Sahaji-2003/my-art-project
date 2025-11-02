# Arthub - Online Art Marketplace
## Complete Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [User Roles & Capabilities](#user-roles--capabilities)
5. [Pages & Functionality](#pages--functionality)
6. [Data Models](#data-models)
7. [Authentication & Security](#authentication--security)
8. [Design & UI Framework](#design--ui-framework)
9. [Project Timeline Overview](#project-timeline-overview)

---

## Project Overview

**Arthub** is a comprehensive MERN stack-based online art marketplace designed to connect artists with art enthusiasts and buyers worldwide. The platform eliminates intermediaries, allowing artists to showcase, market, and sell their artwork directly to consumers. Built with modern web technologies and responsive design principles, Arthub provides a secure, user-friendly environment for the art community.

### Vision
To create an accessible, artist-friendly marketplace that empowers artists to reach global audiences while providing buyers with a curated selection of unique artworks.

### Mission
- Enable artists to build professional online portfolios
- Facilitate secure transactions between artists and buyers
- Foster a supportive community of artists and collectors
- Provide analytics and insights for business growth

---

## Technology Stack

### Frontend
- **React.js** - UI framework with functional components and hooks
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing and navigation
- **Bootstrap 5** - Responsive UI framework (no react-bootstrap)
- **Bootstrap Icons** - Icon library
- **Axios** - HTTP client for API communication
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **JWT (JSON Web Tokens)** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **nodemon** - Auto-restart development server
- **ES6+ Syntax** - Modern JavaScript features

---

## Key Features

### 1. User Authentication & Registration
- Secure email and password registration
- **OTP-based verification** (dummy implementation with UI display)
- Login with persistent sessions
- Password reset functionality
- Social login buttons (Google, Facebook - UI only)
- Protected routes for authenticated users

### 2. Artist Profile Management
- Create/update detailed artist profiles
- Upload profile pictures (stored in `/public/userProfile`)
- Biography and portfolio descriptions
- Social media links (Instagram, Twitter, Website)
- Verification badge system
- Profile sidebar navigation
- Artist stats tracking (sales, rating, total artworks)

### 3. Artwork Management
- Upload single artwork image per piece
- Artwork details:
  - Title (3-200 characters)
  - Description (10-2000 characters)
  - Price
  - Medium (Oil on Canvas, Acrylic, Watercolor, Digital Art, Sculpture, Photography, Mixed Media, Pencil, Charcoal, Other)
  - Style (Abstract, Impressionism, Realism, Surrealism, Contemporary, Modern, Pop Art, Minimalism, Expressionism, Other)
  - Dimensions with units (cm, inch, mm, m)
  - Tags for categorization
  - Status (Available, Sold, Reserved, Unavailable)
- Edit existing artworks
- Delete artworks
- Auto-increment views counter
- Like/Unlike functionality with local state updates
- Image upload with Multer
- Automatic sold status update on purchase

### 4. Search & Discovery
- **Advanced Search** with MongoDB aggregation pipeline
- Search by:
  - Artwork title
  - Artist name
  - Tags
  - Description keywords
- Filters:
  - Medium (dropdown selection)
  - Style (dropdown selection)
  - Price range (min-max)
- Pagination support
- Real-time search results
- Only available artworks shown

### 5. Artwork Display
- **ArtworkCard Component** (reusable)
- Horizontal scrollable trending section
- Bootstrap-based responsive grid
- Like count always visible
- Hover effects and transitions
- Navigate to purchase page on card click
- Consistent styling across Search, Dashboard, and Artist pages

### 6. Purchase & Order Management
- Detailed artwork purchase page
- Two-column layout:
  - **Left**: Order summary, shipping information, payment method, review
  - **Right**: Artwork display, customer reviews
- **Shipping Information**:
  - Full name
  - Email
  - Address
  - City, State, Zip Code
  - Phone number
- **Payment Method**:
  - Credit Card
  - Card number formatting (XXXX-XXXX-XXXX-XXXX)
  - Expiry date formatting (MM/YY)
  - CVC validation
  - Save payment option
- Inline validation with error messages
- Bootstrap modals for success/error feedback
- Auto-generated order numbers
- Order tracking support
- Automatic artwork status update to "Sold"

### 7. Order History
- **My Purchases** page for buyers
- View all past orders
- Order details including:
  - Artwork information
  - Artist details
  - Shipping address
  - Payment information
  - Order status
- **Inventory** page for artists
- View all sales
- Order management tools

### 8. Inventory Management
- **Artist Dashboard** showing:
  - Total artworks count
  - Total sales
  - Total revenue
  - Total views across all artworks
  - Total likes across all artworks
- Browse all artist's artworks
- Edit artwork button (links to Upload page with edit mode)
- Delete artwork functionality
- Real-time stats updates
- Individual artwork details within cards

### 9. Community Features
- **Community Discussions** page
- Top 10 community discussions displayed
- **Search functionality** for discussions:
  - Search by title
  - Search by content
  - Search by category
  - Search by artist name
- **Create posts** with:
  - Title
  - Content (up to 5000 characters)
  - Category (Marketing, Legal, Technique, Inspiration, Critique, General)
- **View posts** with:
  - Author information
  - Like/unlike posts
  - Comments section
- **Comments** system:
  - Add comments to posts
  - Like/unlike comments
  - View all comments
- Sidebar with quick actions
- Bootstrap modals for creating posts and viewing details

### 10. Analytics & Insights
- **Artist Stats**:
  - Total artworks
  - Total sales
  - Total revenue
  - Average price
  - Total views
  - Total likes
- Real-time calculations
- Visual stats cards on inventory page
- Performance tracking

### 11. Public Artist Profiles
- View any artist's profile (`/artist/:userId`)
- Display artist information:
  - Profile picture
  - Artist name
  - Biography
  - Social media links
  - Stats (Artworks, Sales, Rating)
- Browse all artworks by the artist
- Like functionality on artwork cards
- Responsive grid layout
- Click artwork to navigate to purchase

### 12. Dashboard
- **Role-based dashboard** (Artist vs. Buyer)
- **Hero Section**:
  - Typing effect animation (Discover, Create, Connect)
  - Auto-rotating image carousel (top 3 trending artworks)
  - Light blue-to-purple gradient background
  - Call-to-action buttons
- **Quick Access to Features** cards:
  - Upload Art (Artists)
  - Search Artworks (All users)
  - Community (All users)
  - Inventory (Artists)
- **Trending Artworks** section:
  - 8 latest artworks with highest likes
  - Horizontal scrollable cards
  - Navigation arrows
  - Hidden scrollbar
  - Click to like/unlike
  - Click card to navigate to purchase

### 13. Password Management
- **Change Password** page
- Three-step process:
  1. Enter registered email
  2. Verify with OTP (displayed in UI)
  3. Set new password
- OTP display with copy functionality
- Frontend and backend validation
- Bootstrap modal feedback

### 14. Landing Page
- Modern hero section with wallpaper image
- Features section (6 feature cards)
- Call-to-action section
- Bootstrap-based, responsive design
- Navigation to Login/Signup

---

## User Roles & Capabilities

### **Buyer (Regular User)**
1. Register and login
2. Search and browse artworks
3. Filter artworks by various criteria
4. View artwork details
5. Like/Unlike artworks
6. Purchase artworks
7. View purchase history
8. View artist profiles
9. Participate in community discussions
10. Add comments to posts
11. View order details

### **Artist (Registered User with Profile)**
All buyer capabilities, plus:
1. Create artist profile with bio, portfolio, social links
2. Upload profile picture
3. Upload new artworks
4. Edit existing artworks
5. Delete artworks
6. View inventory and sales
7. View analytics and statistics
8. Manage orders and shipments
9. Create community posts
10. View total likes and views across all artworks

### **Guest/Visitor**
1. View landing page
2. See features and benefits
3. Navigate to login/signup

---

## Pages & Functionality

### 1. **LandingPage** (`/`)
- Hero section with wallpaper image
- Features showcase
- Call-to-action buttons
- Navigation to login/signup
- Public access

### 2. **LoginPage** (`/login`)
- Email and password login
- Password visibility toggle
- Social login buttons (Google, Facebook)
- Form validation
- Remember session
- Navigate to dashboard on success
- Public access

### 3. **SignupPage** (`/signup`)
- Two-step registration:
  - **Step 1**: Name, Email, Password
  - **Step 2**: OTP Verification (dummy, shown in UI)
- OTP display with copy functionality
- Social login buttons (Google, Facebook)
- Form validation
- Auto-navigate to login after success
- Public access

### 4. **DashboardPage** (`/dashboard`)
- Role-based content
- Animated hero section
- Quick access cards
- Trending artworks carousel
- Like functionality
- Protected route

### 5. **SearchPage** (`/search`)
- Advanced search bar
- Multiple filter options
- Pagination support
- Grid layout of artworks
- Like functionality
- Click to purchase
- Protected route

### 6. **PurchasePage** (`/purchase/:artworkId`)
- Two-column layout
- Order summary
- Shipping form
- Payment form
- Customer reviews
- Inline validation
- Success modal
- Protected route

### 7. **UploadPage** (`/upload`)
- Create new artwork or edit existing
- Image upload (single image)
- Form validation
- Edit mode detection via URL params
- Pre-populated fields in edit mode
- Protected route (artists only)

### 8. **InventoryPage** (`/inventory`)
- Analytics dashboard
- Artwork management
- Edit/Delete buttons
- Stats cards
- Protected route (artists only)

### 9. **ArtistProfilePage** (`/profile`)
- Create/update profile
- Profile picture upload
- Bio and portfolio
- Social media links
- Sidebar navigation
- Protected route (artists only)

### 10. **ViewArtistProfilePage** (`/artist/:userId`)
- Public artist profile
- Artist information
- All artworks by artist
- Like functionality
- Protected route (authenticated users)

### 11. **MyPurchasesPage** (`/my-purchases`)
- Purchase history
- Order details
- Artist information
- Order status
- Protected route

### 12. **CommunityPage** (`/community`)
- Top 10 discussions
- Search discussions
- Create posts
- Like posts
- Comment system
- Protected route

### 13. **PasswordPage** (`/password`)
- Three-step password reset
- Email verification
- OTP display
- New password setup
- Protected route

### 14. **SettingsPage** (`/settings`)
- User settings
- Protected route

---

## Data Models

### **User Model**
- name (String, required, 2-100 chars)
- email (String, required, unique, lowercase)
- password (String, required, 8+ chars, hashed)
- isArtist (Boolean, default: false)
- isEmailVerified (Boolean, default: false)
- profilePicture (String)
- timestamps

### **ArtistProfile Model**
- userId (ObjectId, ref: User, unique)
- bio (String, max 1000 chars)
- portfolio (String, max 2000 chars)
- socialMediaLinks (Object):
  - facebook, instagram, twitter, website
- profilePicture (String)
- isVerified (Boolean)
- rating (Number, 0-5)
- totalSales (Number)
- totalRevenue (Number)
- timestamps

### **Artwork Model**
- artistId (ObjectId, ref: User, required)
- title (String, required, 3-200 chars)
- description (String, required, 10-2000 chars)
- price (Number, required, min: 0)
- images (Array of Objects):
  - url (String, required)
  - isPrimary (Boolean)
- medium (Enum: Oil on Canvas, Acrylic, Watercolor, Digital Art, Sculpture, Photography, Mixed Media, Pencil, Charcoal, Other)
- style (Enum: Abstract, Impressionism, Realism, Surrealism, Contemporary, Modern, Pop Art, Minimalism, Expressionism, Other)
- dimensions (Object):
  - width, height, depth (Number)
  - unit (Enum: cm, inch, mm, m)
- status (Enum: available, sold, reserved, unavailable)
- tags (Array of Strings)
- views (Number, default: 0)
- likes (Array of ObjectIds, ref: User)
- timestamps
- Indexes: title, description, tags, medium, style, price, artistId, status

### **Order Model**
- buyerId (ObjectId, ref: User, required)
- artworkId (ObjectId, ref: Artwork, required)
- artistId (ObjectId, ref: User, required)
- orderNumber (String, unique, required)
- price (Number, required)
- shippingAddress (Object):
  - street, city, state, country, zipCode
- paymentMethod (Enum: Credit Card, Debit Card, PayPal, Bank Transfer, UPI)
- paymentStatus (Enum: pending, completed, failed, refunded)
- orderStatus (Enum: pending, confirmed, processing, shipped, delivered, cancelled)
- trackingNumber (String)
- transactionId (String)
- timestamps

### **Post Model**
- authorId (ObjectId, ref: User, required)
- title (String, required, max 200 chars)
- content (String, required, max 5000 chars)
- category (Enum: Marketing, Legal, Technique, Inspiration, Critique, General)
- likes (Array of ObjectIds, ref: User)
- views (Number, default: 0)
- isPinned (Boolean, default: false)
- timestamps
- Indexes: authorId, createdAt, category

### **Comment Model**
- postId (ObjectId, ref: Post, required)
- authorId (ObjectId, ref: User, required)
- content (String, required, max 1000 chars)
- likes (Array of ObjectIds, ref: User)
- timestamps
- Indexes: postId, createdAt

### **Review Model**
- artworkId (ObjectId, ref: Artwork, required)
- buyerId (ObjectId, ref: User, required)
- orderId (ObjectId, ref: Order, required)
- rating (Number, required, 1-5)
- comment (String, max 1000 chars)
- timestamps
- Indexes: artworkId, createdAt, buyerId, orderId

### **Connection Model** (Community)
- requesterId (ObjectId, ref: User, required)
- recipientId (ObjectId, ref: User, required)
- status (Enum: pending, accepted, rejected)
- connectionType (String)
- message (String)
- timestamps

---

## Authentication & Security

### **Authentication Flow**
1. **Registration**: Email + Password → OTP Verification → Login
2. **Login**: Email + Password → JWT Token → Dashboard
3. **Session Management**: JWT stored in localStorage
4. **Protected Routes**: Route guards for authenticated users

### **Password Security**
- Bcrypt hashing (10 salt rounds)
- Minimum 8 characters
- Reset via OTP (dummy implementation)
- Secure password comparison

### **Authorization**
- Role-based access (Artist vs. Buyer)
- Token verification middleware
- Owner validation for edits/deletes
- API request authentication

### **File Upload Security**
- Multer for handling multipart/form-data
- File size limits (10MB artwork, 5MB profile)
- File type validation (images only)
- Secure filename generation
- Unique file storage

---

## Design & UI Framework

### **Bootstrap 5 Implementation**
- **No custom CSS** wherever possible
- Responsive grid system
- Utility classes for spacing, colors, typography
- Bootstrap components: cards, modals, alerts, forms
- Bootstrap Icons instead of emojis
- Consistent theme throughout

### **Custom Styling** (Minimal)
- Artwork card hover effects
- Typing animation
- Image zoom transitions
- Horizontal scrollbar hiding
- Gradient backgrounds
- Blinking cursor effect

### **Responsive Design**
- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl
- Flexible grid layouts
- Collapsible navigation
- Touch-friendly buttons

### **User Experience**
- Loading states with spinners
- Error handling with inline messages
- Success modals and alerts
- Form validation feedback
- Smooth page transitions
- Intuitive navigation
- Clear call-to-action buttons

---

## API Endpoints Overview

### **Authentication APIs**
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `POST /api/v1/auth/request-password-reset` - Request password reset OTP
- `POST /api/v1/auth/reset-password` - Reset password with OTP

### **Artist APIs**
- `POST /api/v1/artists/profile` - Create/update artist profile
- `GET /api/v1/artists/profile` - Get own profile
- `GET /api/v1/artists/profile/:userId` - Get artist by ID
- `PUT /api/v1/artists/profile` - Update artist profile
- `POST /api/v1/artists/upload-profile-picture` - Upload profile picture
- `GET /api/v1/artists` - Get all artists
- `GET /api/v1/artists/inventory` - Get artist inventory
- `GET /api/v1/artists/stats` - Get artist statistics

### **Artwork APIs**
- `POST /api/v1/artworks` - Create artwork
- `GET /api/v1/artworks/:artworkId` - Get artwork by ID
- `PUT /api/v1/artworks/:artworkId` - Update artwork
- `DELETE /api/v1/artworks/:artworkId` - Delete artwork
- `GET /api/v1/artworks/search` - Search artworks with filters
- `GET /api/v1/artworks/trending` - Get trending artworks
- `GET /api/v1/artworks/artists/:artistId/artworks` - Get artworks by artist
- `POST /api/v1/artworks/:artworkId/like` - Toggle like on artwork
- `POST /api/v1/artworks/upload-image` - Upload artwork image

### **Order APIs**
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/user` - Get user orders (buyer)
- `GET /api/v1/orders/artist` - Get artist orders (seller)
- `PUT /api/v1/orders/:orderId/status` - Update order status

### **Review APIs**
- `GET /api/v1/reviews/artwork/:artworkId` - Get artwork reviews

### **Community APIs**
- `POST /api/v1/community/posts` - Create post
- `GET /api/v1/community/posts` - Get all posts (with search)
- `GET /api/v1/community/posts/:postId` - Get post by ID
- `PUT /api/v1/community/posts/:postId` - Update post
- `DELETE /api/v1/community/posts/:postId` - Delete post
- `POST /api/v1/community/posts/:postId/like` - Toggle like on post
- `GET /api/v1/community/posts/:postId/comments` - Get comments
- `POST /api/v1/community/posts/:postId/comments` - Add comment
- `POST /api/v1/community/comments/:commentId/like` - Toggle like on comment
- `DELETE /api/v1/community/comments/:commentId` - Delete comment

---

## Project Timeline Overview (10-Day Development)

### **Day 1-2: Foundation & Setup**
- Project initialization
- MERN stack setup
- Database design and models
- Basic routing structure
- Authentication system (JWT)

### **Day 3: User Authentication**
- User registration with OTP (dummy)
- Login functionality
- Protected routes
- Password reset
- Social login UI

### **Day 4-5: Artwork Management**
- Artwork upload functionality
- Image handling with Multer
- Artwork CRUD operations
- Inventory management
- Edit artwork feature

### **Day 6: Search & Discovery**
- Advanced search with MongoDB aggregation
- Filter implementation
- Artwork display cards
- Trending artworks
- Dashboard with hero section

### **Day 7: Purchase Flow**
- Purchase page design
- Order creation
- Shipping and payment forms
- Validation and error handling
- Success/error modals

### **Day 8: Artist Profiles**
- Profile creation/update
- Profile picture upload
- Public artist profiles
- Artist stats calculation
- Sidebar navigation

### **Day 9: Community Features**
- Community discussions
- Posts and comments
- Like functionality
- Search discussions
- Modals and interactions

### **Day 10: Polish & Testing**
- UI refinement with Bootstrap
- Remove custom CSS
- Fix bugs and edge cases
- Responsive design testing
- Documentation

---

## Key Technical Decisions

### **Why Bootstrap 5 (not React-Bootstrap)?**
- Pure CSS framework, no component library
- Better control over styling
- Simpler integration
- Less bundle size
- More flexibility

### **Why MongoDB Aggregation Pipeline?**
- Efficient server-side searching
- Better performance
- Complex query support
- Less client-side processing
- Scalable architecture

### **Why Local State for Likes?**
- Instant UI feedback
- Better UX (no reload)
- Optimistic updates
- Reduced server load
- Smooth interactions

### **Why Dummy OTP Implementation?**
- Quick MVP development
- Focus on core features
- Easy to replace with real service
- Demo-friendly
- Educational purposes

### **File Storage Strategy**
- Frontend public folders for images
- Direct URL paths
- Immediate availability
- No CDN complexity
- Simpler deployment

---

## Component Architecture

### **Reusable Components**
1. **ArtworkCard** - Displays artwork with image, title, artist, price, likes
2. **Header** - Navigation bar with logo, links, profile, actions
3. **Footer** - Footer with links and copyright
4. **ProfileSidebar** - Sidebar navigation for profile pages

### **Page Components**
- LandingPage, LoginPage, SignupPage
- DashboardPage, SearchPage
- PurchasePage, UploadPage
- InventoryPage, ArtistProfilePage
- ViewArtistProfilePage
- MyPurchasesPage, CommunityPage
- PasswordPage, SettingsPage

---

## Notable Features & Implementations

### **Search Functionality**
- MongoDB aggregation pipeline
- Multi-field text search
- Artist name lookup via $lookup
- Filter combinations
- Pagination support

### **Trending Algorithm**
- Sorted by likes count
- Secondary sort by views
- Top 8 results
- Efficient sorting

### **Order Management**
- Auto-generated order numbers
- Status tracking
- Payment status
- Shipping details
- Automatic sold status update

### **Community System**
- Top 10 discussions
- Full-text search
- Category-based posts
- Comment threading
- Like system

### **Profile System**
- Upsert pattern (create or update)
- Auto-assigned isArtist flag
- Social media validation
- Profile picture management

### **Responsive Design**
- Mobile-first Bootstrap
- Collapsible navigation
- Flexible grids
- Touch-optimized

---

## Database Schema Relationships

```
User
├── ArtistProfile (1:1)
├── Artwork (1:Many) - as artistId
├── Order (1:Many) - as buyerId
├── Order (1:Many) - as artistId
├── Post (1:Many) - as authorId
├── Comment (1:Many) - as authorId
├── Review (1:Many) - as buyerId
└── Likes (Many:Many)

Artwork
├── Order (1:Many)
└── Review (1:Many)

Post
└── Comment (1:Many)

Order
└── Review (1:1)
```

---

## Security Considerations

### **Implemented**
- Password hashing (Bcrypt)
- JWT authentication
- Protected routes
- File upload validation
- XSS prevention
- CORS configuration
- Input validation
- Owner authorization

### **Recommendations for Production**
- Email verification (real implementation)
- Rate limiting
- HTTPS enforcement
- CSRF protection
- SQL injection prevention (N/A for NoSQL)
- Secure file storage (cloud)
- API versioning
- Error logging
- Session management

---

## Testing & Quality Assurance

### **Manual Testing**
- User registration and login
- Artwork upload and management
- Search and filter functionality
- Purchase flow
- Community interactions
- Profile management
- Responsive design across devices

### **Known Limitations**
- Social login not integrated
- OTP via email not implemented
- No automated testing
- No CI/CD pipeline
- Limited error handling in some areas

---

## Future Enhancements

### **Short Term**
- Email notification system
- Real OTP implementation
- Social login integration
- Advanced analytics dashboard
- Push notifications

### **Medium Term**
- Payment gateway integration
- Shipping carrier integration
- Advanced search filters
- Artist verification process
- Review and rating system
- Wishlist functionality

### **Long Term**
- Mobile app (React Native)
- AI-powered recommendations
- Virtual gallery tours
- Live auctions
- Subscription plans
- Commission work system

---

## Deployment Considerations

### **Frontend Deployment**
- Build with Vite
- Static file hosting (Netlify, Vercel, AWS S3)
- Environment variables for API URLs
- CDN for assets

### **Backend Deployment**
- Node.js hosting (Heroku, AWS EC2, DigitalOcean)
- MongoDB hosting (MongoDB Atlas)
- Environment variables
- Process manager (PM2)

### **Requirements**
- Node.js >= 14
- MongoDB >= 4.0
- Git
- npm/yarn

---

## Conclusion

**Arthub** is a fully-functional, modern art marketplace demonstrating proficiency in full-stack development with the MERN stack. The platform successfully implements all core features including user management, artwork marketplace, community interaction, and analytics. Built with best practices, modern UI/UX principles, and scalable architecture, Arthub is ready for demonstration and further development.

---

**Document Version:** 1.0  
**Last Updated:** Current  
**Project Status:** Complete MVP  
**Technology:** MERN Stack  
**License:** Educational/Training Purpose

