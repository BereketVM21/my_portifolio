# Full-Stack Portfolio Website

A complete portfolio website with a public facing portfolio and an admin dashboard for content management.

## Features

### Public Portfolio
- **Hero Section**: Dynamic hero with customizable title and subtitle
- **About Me**: Personal bio section
- **Skills**: Categorized skill display with proficiency levels
- **Projects**: Dynamic project showcase with images and links
- **Experience**: Work experience timeline
- **Education**: Educational background
- **Contact Form**: Working contact form that saves messages to the database
- **Control Panel**: Floating draggable settings panel for visitors to customize:
  - Page brightness
  - Wallpaper presets
  - Light/dark mode toggle
  - Font size adjustment
  - Preferences saved to localStorage

### Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Dashboard Overview**: Quick stats on projects, skills, experience, and messages
- **Project Management**: Full CRUD operations for projects with image upload
- **Skill Management**: Add, edit, and delete skills with categories
- **Experience Management**: Manage work experience and education
- **Message Management**: View and manage contact form submissions
- **Bio Editor**: Update hero content, about section, and social links
- **Settings**: Configure default visitor settings (brightness, wallpaper, etc.)
- **Password Management**: Change admin password

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Express Validator for input validation

### Frontend
- React 18
- React Router
- Vite
- Axios for API calls
- Context API for state management

## Design

- **Two-color theme**: Navy blue (#001f3f) and white/off-white
- **Responsive design**: Mobile, tablet, and desktop optimized
- **Modern UI**: Clean, minimal, professional design
- **Smooth transitions**: Interactive animations and transitions
- **Typography**: Optimized font hierarchy and spacing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   # Or use a cloud MongoDB instance and update MONGODB_URI
   ```

6. **Start the server**
   ```bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
   ```

7. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

8. **Access the application**
   - Public portfolio: http://localhost:3000
   - Admin login: http://localhost:3000/admin
   - API: http://localhost:5000

## Initial Setup

1. **Initialize Admin Account**
   - Go to http://localhost:3000/admin
   - Click "Initialize Admin (First Time Setup)"
   - Enter your desired username and password
   - This creates the initial admin account

2. **Add Content**
   - Login with your admin credentials
   - Use the dashboard to add:
     - Bio information and social links
     - Skills with categories
     - Projects with images
     - Work experience and education
     - Configure default visitor settings

## Usage

### Public Site
- Visitors can view your portfolio content
- Use the floating settings panel (gear icon) to customize their viewing experience
- Contact form submissions are saved and can be viewed in the admin dashboard

### Admin Dashboard
- Login at `/admin`
- Navigate using the sidebar menu
- Add, edit, and delete content
- View and manage contact messages
- Update site settings

## Project Structure

```
portfolio-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # Image upload directory
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin
- `PUT /api/auth/password` - Change password
- `POST /api/auth/initialize` - Initialize first admin

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

### Experience
- `GET /api/experience` - Get all experience
- `GET /api/experience/category/:category` - Get by category
- `GET /api/experience/:id` - Get single experience
- `POST /api/experience` - Create experience (admin)
- `PUT /api/experience/:id` - Update experience (admin)
- `DELETE /api/experience/:id` - Delete experience (admin)

### Messages
- `POST /api/messages` - Create message (public)
- `GET /api/messages` - Get all messages (admin)
- `GET /api/messages/:id` - Get single message (admin)
- `PUT /api/messages/:id/read` - Mark as read (admin)
- `DELETE /api/messages/:id` - Delete message (admin)

### Bio
- `GET /api/bio` - Get bio information
- `PUT /api/bio` - Update bio (admin)

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (admin)

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting for production
- Use HTTPS in production
- Regular security updates for dependencies

## Deployment

### Backend Deployment
1. Deploy to a hosting service (Heroku, DigitalOcean, etc.)
2. Set environment variables
3. Ensure MongoDB is accessible
4. Build and start the server

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)
3. Update API base URL for production

## License

ISC

## Author

Your Name - Portfolio Website
