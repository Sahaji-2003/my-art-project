# Arthub API Documentation

**Base URL:** `http://localhost:3001/api/v1`

**Authentication:** Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Authentication APIs

### 1. User Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "isArtist": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "isArtist": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isArtist": true,
    "profilePicture": "/userProfile/profile.jpg"
  }
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`
*Requires Authentication*

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "johnupdated@example.com"
  }
}
```

---

### 5. Request Password Reset
**POST** `/auth/request-password-reset`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP generated successfully",
  "data": {
    "otp": "123456"
  }
}
```

---

### 6. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Artist Profile APIs

### 7. Create/Update Artist Profile
**POST** `/artists/profile`
*Requires Authentication*

**Request Body:**
```json
{
  "bio": "I am a professional artist with 10 years of experience",
  "portfolio": "My portfolio includes various abstract paintings",
  "socialMediaLinks": {
    "instagram": "https://instagram.com/artist",
    "twitter": "https://twitter.com/artist",
    "website": "https://artistportfolio.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Artist profile created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "bio": "I am a professional artist...",
    "profilePicture": "/userProfile/profile.jpg"
  }
}
```

---

### 8. Get Artist Profile
**GET** `/artists/profile` or `/artists/profile/:userId`
*Public endpoint (/:userId), Protected for own profile*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "/userProfile/profile.jpg"
    },
    "bio": "I am a professional artist...",
    "rating": 4.5,
    "totalSales": 15
  }
}
```

---

### 9. Update Artist Profile
**PUT** `/artists/profile`
*Requires Authentication*

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "socialMediaLinks": {
    "instagram": "https://instagram.com/newhandle"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Artist profile updated successfully",
  "data": { ... }
}
```

---

### 10. Upload Profile Picture
**POST** `/artists/upload-profile-picture`
*Requires Authentication*
*Content-Type: multipart/form-data*

**Request Body (Form Data):**
```
profilePicture: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "url": "/userProfile/profile_1234567890.jpg",
    "filename": "profile_1234567890.jpg",
    "size": 123456
  }
}
```

---

### 11. Get All Artists
**GET** `/artists?page=1&limit=10`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 12. Get Artist Inventory
**GET** `/artists/inventory`
*Requires Authentication (Artist only)*

**Response:**
```json
{
  "success": true,
  "data": {
    "artworks": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Beautiful Sunset",
        "price": 500,
        "status": "available"
      }
    ]
  }
}
```

---

### 13. Get Artist Stats
**GET** `/artists/stats`
*Requires Authentication (Artist only)*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15,
    "totalRevenue": 7500,
    "averagePrice": 500
  }
}
```

---

## Artwork APIs

### 14. Create Artwork
**POST** `/artworks`
*Requires Authentication (Artist only)*

**Request Body:**
```json
{
  "title": "Beautiful Sunset",
  "description": "A stunning painting of a sunset over the ocean",
  "price": 500,
  "medium": "Oil on Canvas",
  "style": "Impressionism",
  "images": [
    {
      "url": "/assets/images/art/artwork_123.jpg",
      "isPrimary": true
    }
  ],
  "dimensions": {
    "width": 60,
    "height": 80,
    "unit": "cm"
  },
  "tags": ["sunset", "ocean", "nature"],
  "status": "available"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Artwork uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Sunset",
    "price": 500,
    "artistId": "507f1f77bcf86cd799439011"
  }
}
```

---

### 15. Get Single Artwork
**GET** `/artworks/:artworkId`
*Public endpoint*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Sunset",
    "description": "A stunning painting...",
    "price": 500,
    "artist": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "images": [...],
    "likesCount": 25,
    "isLiked": false
  }
}
```

---

### 16. Update Artwork
**PUT** `/artworks/:artworkId`
*Requires Authentication (Artist owner only)*

**Request Body:**
```json
{
  "title": "Updated Title",
  "price": 600,
  "status": "sold"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Artwork updated successfully",
  "data": { ... }
}
```

---

### 17. Delete Artwork
**DELETE** `/artworks/:artworkId`
*Requires Authentication (Artist owner only)*

**Response:**
```json
{
  "success": true,
  "message": "Artwork deleted successfully"
}
```

---

### 18. Search Artworks
**GET** `/artworks/search?q=sunset&medium=Oil%20on%20Canvas&style=Impressionism&price_min=100&price_max=1000&page=1&limit=12`
*Public endpoint*

**Query Parameters:**
- `q` (optional): Search query (searches in title, description, tags, artist name)
- `medium` (optional): Filter by medium
- `style` (optional): Filter by style
- `price_min` (optional): Minimum price
- `price_max` (optional): Maximum price
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Beautiful Sunset",
      "price": 500,
      "artist": {
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

---

### 19. Get Trending Artworks
**GET** `/artworks/trending?limit=8`
*Public endpoint*

**Query Parameters:**
- `limit` (optional): Number of artworks (default: 8)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Beautiful Sunset",
      "likesCount": 50,
      "isLiked": false,
      "artist": {
        "name": "John Doe"
      }
    }
  ]
}
```

---

### 20. Get Artworks by Artist
**GET** `/artworks/artists/:artistId/artworks?page=1&limit=12`
*Public endpoint*

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 10,
    "pages": 1
  }
}
```

---

### 21. Toggle Like on Artwork
**POST** `/artworks/:artworkId/like`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "artworkId": "507f1f77bcf86cd799439013",
    "likesCount": 26,
    "isLiked": true
  }
}
```

---

### 22. Upload Artwork Image
**POST** `/artworks/upload-image`
*Requires Authentication*
*Content-Type: multipart/form-data*

**Request Body (Form Data):**
```
image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/assets/images/art/artwork_1234567890.jpg",
    "filename": "artwork_1234567890.jpg",
    "size": 234567
  }
}
```

---

## Order APIs

### 23. Create Order
**POST** `/orders` or `/orders/:artworkId/purchase`
*Requires Authentication*

**Request Body:**
```json
{
  "artworkId": "507f1f77bcf86cd799439013",
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Credit Card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Artwork purchased successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-1701234567890-ABC123XYZ",
    "artworkId": "507f1f77bcf86cd799439013",
    "price": 500,
    "orderStatus": "confirmed",
    "paymentStatus": "completed"
  }
}
```

---

### 24. Get User Orders
**GET** `/orders/user` or `/orders/my-orders`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-1701234567890-ABC123XYZ",
      "artworkId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Beautiful Sunset",
        "price": 500,
        "artistId": {
          "name": "John Doe"
        }
      },
      "orderStatus": "confirmed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 25. Get Artist Orders (Seller)
**GET** `/orders/artist-orders`
*Requires Authentication (Artist only)*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-1701234567890-ABC123XYZ",
      "artworkId": {
        "title": "Beautiful Sunset",
        "price": 500
      },
      "buyerId": {
        "name": "Jane Buyer",
        "email": "jane@example.com"
      },
      "orderStatus": "confirmed"
    }
  ]
}
```

---

### 26. Get Single Order
**GET** `/orders/:orderId`
*Requires Authentication (Buyer or Seller only)*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-1701234567890-ABC123XYZ",
    "artworkId": { ... },
    "buyerId": { ... },
    "artistId": { ... },
    "shippingAddress": { ... },
    "orderStatus": "confirmed"
  }
}
```

---

### 27. Update Order Status
**PUT** `/orders/:orderId/status`
*Requires Authentication (Artist/Seller only)*

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderStatus": "shipped",
    "trackingNumber": "TRACK123456789"
  }
}
```

---

## Review APIs

### 28. Get Artwork Reviews
**GET** `/reviews/artwork/:artworkId`
*Public endpoint*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "rating": 5,
      "comment": "Amazing artwork!",
      "buyerId": {
        "name": "Jane Buyer"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 29. Create Review
**POST** `/reviews`
*Requires Authentication (Buyer only)*

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439014",
  "rating": 5,
  "comment": "Amazing artwork! Very satisfied with my purchase."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "rating": 5,
    "comment": "Amazing artwork!..."
  }
}
```

---

### 30. Update Review
**PUT** `/reviews/:reviewId`
*Requires Authentication (Review owner only)*

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review text"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": { ... }
}
```

---

### 31. Delete Review
**DELETE** `/reviews/:reviewId`
*Requires Authentication (Review owner only)*

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## Community APIs

### 32. Create Post
**POST** `/community/posts`
*Requires Authentication*

**Request Body:**
```json
{
  "title": "How to Price Your Artwork",
  "content": "Here are some tips for pricing your artwork...",
  "category": "Marketing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "title": "How to Price Your Artwork",
    "content": "Here are some tips...",
    "author": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "likes": [],
    "views": 0
  }
}
```

---

### 33. Get All Posts
**GET** `/community/posts?page=1&limit=10&q=marketing`
*Requires Authentication*

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `q` (optional): Search query (searches in title, content, category, author name)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "How to Price Your Artwork",
      "content": "Here are some tips...",
      "category": "Marketing",
      "author": {
        "name": "John Doe"
      },
      "likes": 5,
      "views": 50
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 34. Get Single Post
**GET** `/community/posts/:postId`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "title": "How to Price Your Artwork",
    "content": "Here are some tips...",
    "author": {
      "name": "John Doe"
    },
    "likes": 5,
    "views": 50
  }
}
```

---

### 35. Update Post
**PUT** `/community/posts/:postId`
*Requires Authentication (Post owner only)*

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": { ... }
}
```

---

### 36. Delete Post
**DELETE** `/community/posts/:postId`
*Requires Authentication (Post owner only)*

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 37. Toggle Like on Post
**POST** `/community/posts/:postId/like`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "likes": 6,
    "isLiked": true
  }
}
```

---

### 38. Get Comments for Post
**GET** `/community/posts/:postId/comments?page=1&limit=10`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "content": "Great tips!",
      "author": {
        "name": "Jane Buyer"
      },
      "likes": 2,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### 39. Add Comment to Post
**POST** `/community/posts/:postId/comments`
*Requires Authentication*

**Request Body:**
```json
{
  "content": "Great tips! Thanks for sharing."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "content": "Great tips! Thanks for sharing.",
    "author": {
      "name": "Jane Buyer"
    },
    "likes": 0
  }
}
```

---

### 40. Toggle Like on Comment
**POST** `/community/comments/:commentId/like`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "likes": 3,
    "isLiked": true
  }
}
```

---

### 41. Delete Comment
**DELETE** `/community/comments/:commentId`
*Requires Authentication (Comment owner only)*

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Community Connection APIs

### 42. Send Connection Request
**POST** `/community/connections`
*Requires Authentication*

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "connectionType": "collaboration",
  "message": "Would love to collaborate on a project"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "requesterId": "507f1f77bcf86cd799439010",
    "recipientId": "507f1f77bcf86cd799439011",
    "status": "pending"
  }
}
```

---

### 43. Get Connection Requests
**GET** `/community/requests`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "requesterId": {
        "name": "John Doe"
      },
      "status": "pending",
      "message": "Would love to collaborate..."
    }
  ]
}
```

---

### 44. Get Connections
**GET** `/community/connections`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "requesterId": { ... },
      "recipientId": { ... },
      "status": "accepted"
    }
  ]
}
```

---

### 45. Update Connection Status
**PUT** `/community/connections/:connectionId`
*Requires Authentication*

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection accepted",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "status": "accepted"
  }
}
```

---

### 46. Delete Connection
**DELETE** `/community/connections/:connectionId`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "message": "Connection deleted successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads use `multipart/form-data` content type
- JWT tokens expire after 30 days (default)
- Pagination is 1-indexed (page 1, 2, 3...)
- All monetary values are in the base currency unit (e.g., dollars, no cents)

