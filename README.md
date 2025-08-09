# Business Ideas Database

A modern, comprehensive database of business ideas with detailed analysis, investment requirements, and market insights. Built with React, Node.js, and styled with Mobbin-inspired design.

## Features

- **44 Business Ideas**: Comprehensive database of validated business opportunities (with more being added regularly)
- **Advanced Filtering**: Filter by category, investment level, difficulty, and search terms
- **Detailed Analysis**: Each idea includes market analysis, pros/cons, features, and implementation guidance
- **Modern UI**: Clean, responsive design inspired by Mobbin's aesthetic
- **Real-time Search**: Instant search functionality across all business ideas
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **User Authentication**: Secure login and registration system
- **Google OAuth**: Sign in with Google for seamless authentication
- **Saved Ideas**: Save and manage your favorite business ideas

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Google Auth Library** - Google OAuth integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Business-Ideas
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Installation

If you prefer to install dependencies separately:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Project Structure

```
Business-Ideas/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── data/              # Business ideas data
│   ├── index.js           # Express server
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

### Server
- `npm run dev` - Start server with nodemon (auto-restart on changes)
- `npm start` - Start server in production mode

### Client
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/google` - Login with Google OAuth
- `GET /api/auth/me` - Get current user info (requires authentication)

### Saved Ideas (requires authentication)
- `GET /api/saved-ideas` - Get user's saved ideas
- `POST /api/saved-ideas` - Save an idea
- `DELETE /api/saved-ideas/:ideaId` - Remove a saved idea

### Business Ideas
- `GET /api/ideas` - Get all business ideas with filtering and pagination (44 total ideas)
- `GET /api/ideas/:id` - Get a specific business idea by ID

### Categories
- `GET /api/categories` - Get all available categories

### Statistics
- `GET /api/stats` - Get database statistics

### Query Parameters
- `search` - Search term for filtering ideas
- `category` - Filter by category
- `investmentLevel` - Filter by investment level (low/medium/high)
- `difficulty` - Filter by difficulty (low/medium/high)
- `page` - Page number for pagination
- `limit` - Number of items per page

## Business Ideas Data Structure

Each business idea includes:

```javascript
{
  id: "unique-id",
  title: "Business Idea Title",
  description: "Detailed description of the business idea",
  categories: ["category1", "category2"],
  investmentLevel: "low|medium|high",
  estimatedCost: "$X,XXX - $XX,XXX",
  timeToLaunch: "X-X months",
  potentialRevenue: "$XX,XXX - $XXX,XXX/year",
  difficulty: "low|medium|high",
  marketSize: "Small|Medium|Large",
  image: "image-url",
  features: ["feature1", "feature2"],
  pros: ["pro1", "pro2"],
  cons: ["con1", "con2"]
}
```

## Customization

### Adding New Business Ideas

1. Edit `server/data/businessIdeas.js`
2. Add new idea objects following the data structure above
3. Restart the server

### Styling

The project uses Tailwind CSS with custom design tokens. To modify the design:

1. Edit `client/tailwind.config.js` for theme customization
2. Modify `client/src/index.css` for custom styles
3. Update component classes as needed

### Categories

To add new categories:

1. Add the category name to business ideas in `server/data/businessIdeas.js`
2. The API will automatically detect and serve new categories

## Deployment

### Frontend (React)
```bash
cd client
npm run build
```

The build folder can be deployed to any static hosting service (Netlify, Vercel, etc.).

### Backend (Node.js)
```bash
cd server
npm start
```

Deploy to services like Heroku, Railway, or any Node.js hosting platform.

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

### Google OAuth Setup
For Google authentication to work, you'll need to set up Google OAuth credentials. See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ for entrepreneurs worldwide**
