<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Horizon+</h3>

  <p align="center">
    Your All-in-One Platform for Personal & Professional Growth
    <br />
    <a href="https://github.com/vaibhav13-ops/horizon-plus"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://horizon-plus-app.vercel.app/">View Demo</a>
  
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Horizon+ is a comprehensive personal and professional development platform that empowers users to reach their full potential through AI-powered guidance, expert mentorship, and structured growth journeys. The platform combines intelligent goal-setting, reflective journaling, AI coaching, and expert consultations in one seamless experience.

### Key Features:

**For Users:**
* **Action Board** - Visualize goals with AI-generated suggestions and curated YouTube recommendations
* **Growth Compass** - Private journaling with intelligent learning resource curation
* **AI Coach** - 24/7 mindset mentor with personalized coaching conversations
* **Journey Discovery** - Browse and enroll in structured growth programs
* **Expert Network** - Book sessions with verified professional consultants
* **Progress Analytics** - Comprehensive tracking of achievements and growth patterns

**For Consultants:**
* **Professional Dashboard** - Manage profile, availability, and client bookings
* **Journey Creation** - Design and publish structured learning programs
* **Client Management** - Handle bookings with integrated video calling
* **Revenue Tracking** - Monitor earnings and session analytics
* **Profile Management** - Build reputation through ratings and reviews

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![React][React.js]][React-url]
[![Node.js][Node.js]][Node-url]
[![Express.js][Express.js]][Express-url]
[![MongoDB][MongoDB]][MongoDB-url]
[![Tailwind CSS][TailwindCSS]][Tailwind-url]
[![Google AI][GoogleAI]][GoogleAI-url]
[![Stripe][Stripe]][Stripe-url]
[![JWT][JWT]][JWT-url]
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:
* Node.js (v18.x or higher)
  ```sh
  node --version
  ```
* npm
  ```sh
  npm install npm@latest -g
  ```
* MongoDB (local installation or cloud instance)

### Installation

1. **Get API Keys** - You'll need the following API keys:
   - Google Gemini AI API Key at [https://ai.google.dev/](https://ai.google.dev/)
   - YouTube Data API v3 Key at [https://console.developers.google.com/](https://console.developers.google.com/)
   - Stripe API Keys at [https://stripe.com/](https://stripe.com/)
   - MongoDB connection string (local or MongoDB Atlas)

2. **Clone the repository**
   ```sh
   git clone https://github.com/vaibhav13-ops/horizon-plus.git
   cd horizon-plus
   ```

3. **Set up Backend**
   ```sh
   cd server
   npm install
   ```

4. **Set up Frontend**
   ```sh
   cd ../client
   npm install
   ```

5. **Environment Configuration**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Database
   MONGO_URL=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key_here
   
   # AI Services
   GEMINI_API_KEY=your_google_gemini_api_key
   YOUTUBE_API_KEY=your_youtube_data_api_key
   
   # Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@horizonplus.com
   ```

6. **Start the Development Servers**
   
   **Backend (Terminal 1):**
   ```sh
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```sh
   cd client
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### For Users

1. **Register/Login** - Create an account or login with existing credentials
2. **Set Goals** - Use the Action Board to visualize and set your personal/professional goals
3. **AI Suggestions** - Get intelligent recommendations and YouTube resources for each goal
4. **Journal Progress** - Use Growth Compass to reflect on your journey and get curated learning materials
5. **AI Coaching** - Chat with your personal AI coach for guidance and motivation
6. **Find Experts** - Browse consultants and book 1-on-1 sessions
7. **Join Journeys** - Enroll in structured programs designed by expert consultants

### For Consultants

1. **Create Profile** - Set up your professional profile with expertise areas and rates
2. **Manage Availability** - Set your schedule for client bookings
3. **Design Journeys** - Create structured learning programs for your expertise area
4. **Handle Bookings** - Manage client sessions with integrated video calling
5. **Track Revenue** - Monitor your earnings and client feedback

### API Integration Examples

```javascript
// Authentication
const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Create Vision Item
const createVisionItem = async (title, imageUrl) => {
  const response = await fetch('/api/visionboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, imageUrl })
  });
  return response.json();
};
```

For more examples and detailed API documentation, please refer to the [API Reference](#api-reference) section.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- API REFERENCE -->
## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user info |

### Vision Board / Action Board

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visionboard` | Get user's vision items |
| POST | `/api/visionboard` | Create new vision item |
| DELETE | `/api/visionboard/:id` | Delete vision item |
| POST | `/api/visionboard/:id/regenerate` | Regenerate AI suggestions |

### Growth Compass / Joy Log

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/joylog` | Get journal entries |
| POST | `/api/joylog` | Create journal entry |
| PUT | `/api/joylog/:id` | Update journal entry |
| DELETE | `/api/joylog/:id` | Delete journal entry |

### AI Coach

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coach` | Send message to AI coach |

### Consultants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/consultants` | Get all consultants |
| GET | `/api/consultants/:id` | Get consultant profile |
| GET | `/api/consultants/profile/me` | Get own profile (consultant only) |
| PUT | `/api/consultants/profile` | Update profile (consultant only) |

### Journeys

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journeys` | Get published journeys |
| POST | `/api/journeys` | Create journey (consultant only) |
| GET | `/api/journeys/my-enrollments` | Get user enrollments |
| POST | `/api/journeys/enroll` | Enroll in journey |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Core Platform Development
- [x] AI Integration (Google Gemini)
- [x] Payment Processing (Stripe)
- [x] Consultant Dashboard
- [x] Journey Management System
- [ ] Mobile Application (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] Group Coaching Features
- [ ] Calendar Integration
- [ ] Offline Mode Support
- [ ] Multi-language Support
    - [ ] Spanish
    - [ ] French
    - [ ] Hindi
- [ ] Advanced AI Features
    - [ ] Voice Coaching
    - [ ] Emotional Intelligence Analysis
    - [ ] Personalized Learning Paths

See the [open issues](https://github.com/vaibhav13-ops/horizon-plus/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear and descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Ensure your code passes all existing tests

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Google Gemini AI](https://ai.google.dev/) for providing advanced AI capabilities
* [YouTube Data API](https://developers.google.com/youtube/v3) for educational content curation
* [Stripe](https://stripe.com/) for secure payment processing
* [Render](https://render.com/) for reliable hosting and deployment
* [React](https://reactjs.org/) for the powerful frontend framework
* [Node.js](https://nodejs.org/) for the robust backend runtime
* [MongoDB](https://www.mongodb.com/) for flexible data storage
* [Tailwind CSS](https://tailwindcss.com/) for rapid UI development


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/vaibhav13-ops/horizon-plus.svg?style=for-the-badge
[contributors-url]: https://github.com/vaibhav13-ops/horizon-plus/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vaibhav13-ops/horizon-plus.svg?style=for-the-badge
[forks-url]: https://github.com/vaibhav13-ops/horizon-plus/network/members
[stars-shield]: https://img.shields.io/github/stars/vaibhav13-ops/horizon-plus.svg?style=for-the-badge
[stars-url]: https://github.com/vaibhav13-ops/horizon-plus/stargazers
[issues-shield]: https://img.shields.io/github/issues/vaibhav13-ops/horizon-plus.svg?style=for-the-badge
[issues-url]: https://github.com/vaibhav13-ops/horizon-plus/issues
[license-shield]: https://img.shields.io/github/license/vaibhav13-ops/horizon-plus.svg?style=for-the-badge
[license-url]: https://github.com/vaibhav13-ops/horizon-plus/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/vaibhav-sharma-dev
[product-screenshot]: https://drive.google.com/uc?id=13-RpJ7ncU-RkQ0FaFm_WvPAZFJDSnsAM
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[GoogleAI]: https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white
[GoogleAI-url]: https://ai.google.dev/
[Stripe]: https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white
[Stripe-url]: https://stripe.com/
[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[JWT-url]: https://jwt.io/
