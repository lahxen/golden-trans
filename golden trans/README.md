# Simple React App

A simple React project setup to get you started quickly!

## Project Structure

```
simple-react-app/
├── src/
│   ├── App.jsx          # Main component
│   ├── App.css          # Component styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── .gitignore          # Git ignore file
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- OpenRouter API key (for Claude AI features) - Get it at https://openrouter.io

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenRouter API key to the `.env` file:
   ```
   VITE_ANTHROPIC_BASE_URL=https://openrouter.io/api/v1
   VITE_ANTHROPIC_AUTH_TOKEN=<your-openrouter-api-key>
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features

- ✅ Counter component with increment/decrement functionality
- ✅ Claude AI Chat integration via OpenRouter
- ✅ Real-time message streaming
- ✅ Responsive design with mobile support
- ✅ Modern CSS styling with hover effects
- ✅ Hot module replacement (HMR) for fast development

## What's Included

- **React 18** - Latest React library
- **Vite** - Fast build tool and development server
- **React Router Ready** - Easy to add routing
- **Responsive Design** - Mobile-friendly layout

## Next Steps

1. Edit `src/App.jsx` to create your components
2. Add new components in the `src` folder
3. Style your components with CSS or CSS modules
4. Use `src/config/apiConfig.js` to make Claude API calls
5. Build and deploy when ready

## Claude AI Integration

The app includes a `ChatComponent` that connects to Claude via OpenRouter API.

### Using the Claude API

Import and use the API helper:

```javascript
import { makeClaudeRequest } from './config/apiConfig'

const response = await makeClaudeRequest([
  { role: 'user', content: 'Hello!' }
])
```

### API Configuration

Environment variables in `.env`:
- `VITE_ANTHROPIC_BASE_URL` - OpenRouter API endpoint
- `VITE_ANTHROPIC_AUTH_TOKEN` - Your OpenRouter API key

Happy coding! 🚀
