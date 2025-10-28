# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 **Key Features Implemented**:

✅ **Modern UI/UX**:
- Gradient backgrounds with patterns
- Smooth animations and transitions
- Responsive design for all devices
- Hover effects and micro-interactions

✅ **Form Validation**:
- Email format validation
- Password strength requirements (min 8 chars)
- Password confirmation matching
- Real-time error feedback

✅ **Security**:
- JWT token storage in localStorage
- Protected routes
- Automatic token injection in API calls
- Auto-redirect on unauthorized access

✅ **User Experience**:
- Loading states during API calls
- Clear error messages
- Success feedback
- Disabled buttons during submission
- Auto-navigation after login/signup

## 📁 **File Structure**:
```
src/
├── services/
│   └── api.service.ts      # All API calls
├── pages/
│   ├── LandingPage.tsx     # Home page
│   ├── LoginPage.tsx       # Login form
│   └── SignupPage.tsx      # Registration form
├── styles/
│   └── App.css             # Global styles
├── App.tsx                 # Main app with routing
└── main.tsx                # Entry point