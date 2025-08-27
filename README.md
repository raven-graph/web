# RavenGraph

A Next.js application for network and market analysis.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
dmt-web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Landing page
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   └── ui/            # UI component library
│   └── lib/               # Utility functions
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Bundler**: Turbopack

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm

### Environment Setup
Create a `.env.local` file for local development:
```env
# Add your environment variables here
```

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement responsive design patterns

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

---

*Private project - All rights reserved.*
