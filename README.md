# Arthub – Online Art Marketplace

## Overview

Arthub is a MERN stack-based online marketplace designed for artists to showcase and sell their artwork directly to buyers without intermediaries. The platform ensures ease of use, secure transactions, and accessibility for both emerging and professional artists.

## Key Features

- **Artist Profiles** – Create, manage, and personalize artist portfolios
- **Artwork Uploads** – Display high-quality images and details of artworks
- **Buyer Interaction** – Search, filter, and purchase artwork easily
- **Community** – Connect artists and buyers for collaboration and support
- **Analytics** – Provide insights into sales and performance for artists

## Technical & Design Requirements

1. **Technology Stack**: MERN (MongoDB, Express.js, React.js, Node.js)
2. **Version Control**: Git (minimum one commit/push per trainee per day)
3. **UI/UX**: Material Design, consistent theme, web accessibility (WCAG)
4. **Validation & Error Handling**: Form validation, user-friendly messages
5. **Security**: Encryption, captcha, and secure transactions

## Product Backlog (User Stories)

### User Story 1: User Registration – 5 Points
**As a visitor, I should be able to register on Arthub.**

- **Must Have**: Name, email, and password fields
- **Should Have**: Captcha, social sign-up
- **Acceptance**: Successful registration and confirmation email

### User Story 2: Artist Profile Creation – 8 Points
**As an artist, I should be able to create a detailed profile.**

- **Must Have**: Basic info, bio, and portfolio
- **Should Have**: Profile picture, social links
- **Acceptance**: Valid formats, complete info required

### User Story 3: Artwork Upload – 13 Points
**As an artist, I should be able to upload artworks.**

- **Must Have**: Title, description, price, high-quality image
- **Should Have**: Medium, style, multiple images
- **Acceptance**: Successful uploads with quality checks

### User Story 4: Artwork Search – 8 Points
**As a buyer, I should be able to search for artwork.**

- **Must Have**: Search by artist, title, style
- **Should Have**: Filter by medium and price
- **Acceptance**: Accurate, filtered search results

### User Story 5: Artwork Purchase – 13 Points
**As a buyer, I should be able to securely purchase artwork.**

- **Must Have**: Encrypted checkout, shipping and payment
- **Should Have**: Confirmation email, tracking, reviews
- **Acceptance**: Successful order, validation for payment/address

### User Story 6: Inventory Management – 8 Points
**As an artist, I should manage artworks and sales.**

- **Must Have**: View inventory and sales
- **Should Have**: Edit/delete listings, view analytics
- **Acceptance**: Smooth updates, no data errors

### User Story 7: Community Interaction – 5 Points
**As an artist, I should connect with others.**

- **Must Have**: Community section for interaction
- **Should Have**: Collaboration tools and marketing tips
- **Acceptance**: Functional artist-buyer communication

## Accessibility & Quality Guidelines

- Maintain WCAG-compliant accessible design
- Ensure color and typography consistency
- Avoid spelling or grammatical errors
- Follow unified styling via styles.css

## Project Structure

```
my-art-project/
├── backend/                 # Node.js/Express.js backend
│   ├── config/             # Database and configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── styles/         # CSS styling
│   └── public/             # Static assets
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-art-project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
```bash
# Create .env files in both backend and frontend directories
# Add your MongoDB connection string and other required variables
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Contributing

- Follow the established coding standards
- Make at least one commit/push per day
- Ensure all tests pass before submitting pull requests
- Follow the accessibility and quality guidelines

## License

This project is part of a training program and is for educational purposes.