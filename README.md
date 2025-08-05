# Binaried - Admin Management Platform

A modern, responsive admin management platform built with Next.js, TypeScript, and Tailwind CSS. This application provides comprehensive tools for managing administrators, societies, and their activities in a residential community management system.

## 🚀 Features

### Core Functionality
- **Admin Management**: Create, view, edit, and delete administrator accounts
- **Society Assignment**: Assign multiple residential societies to administrators
- **Activity Tracking**: Monitor admin activities and performance metrics
- **Real-time Search**: Search admins by name or email with instant results
- **Advanced Filtering**: Filter by status (active, inactive, pending)
- **Sorting Options**: Sort by name, last activity, society count, login count, or tickets resolved
- **Pagination**: Efficient data loading with paginated results
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### User Interface
- **Modern Dashboard**: Clean, intuitive interface with real-time statistics
- **Modal Forms**: Smooth create/edit forms with validation
- **Toast Notifications**: User-friendly success/error feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Status Indicators**: Visual status badges and activity indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with class-variance-authority
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Layer**: Custom service layer with mock data

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd binaried
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
binaried/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Layout components (Header, Sidebar)
│   └── ui/               # Base UI components
├── context/              # React Context providers
├── data/                 # Mock data and data utilities
├── hooks/                # Custom React hooks
├── services/             # Data service layer
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Feature Walkthrough

### 1. Dashboard Overview
The main dashboard displays:
- **Statistics Cards**: Total admins, active admins, pending admins, total assignments
- **Admin List**: Paginated list of all administrators
- **Search & Filters**: Real-time search and status filtering
- **Quick Actions**: Create new admin button

### 2. Admin Management

#### Viewing Admins
- Click on any admin card to view detailed information
- See assigned societies, recent activities, and performance metrics
- Access edit and delete options from the detail view

#### Creating Admins
1. Click "Create Admin" button
2. Fill out the form with:
   - Name, email, phone
   - Status (active/pending)
   - Assigned societies (multi-select)
   - Permissions
3. Submit to create the new admin

#### Editing Admins
1. Click "Edit" on any admin card or detail view
2. Modify any field in the form
3. Save changes to update the admin

#### Deleting Admins
- Click "Delete" button on admin cards or detail view
- Confirm deletion in the modal dialog

### 3. Search & Filtering
- **Search**: Type in the search bar to find admins by name or email
- **Status Filter**: Filter by all, active, inactive, or pending status
- **Sorting**: Sort by name, last activity, society count, login count, or tickets resolved
- **Pagination**: Navigate through pages of results

### 4. Admin Details
Each admin detail view shows:
- Personal information (name, email, phone, status)
- Assigned societies with unit counts
- Performance metrics (login count, tickets resolved)
- Recent activities timeline
- Quick action buttons (edit, delete)

## 🎨 Design Decisions

### Architecture Patterns

#### 1. Service Layer Pattern
- **Decision**: Implemented a dedicated `DataService` class
- **Rationale**: Separates data logic from UI components, making the codebase more maintainable and testable
- **Benefits**: Easy to swap mock data with real API calls, centralized data management

#### 2. Context API for State Management
- **Decision**: Used React Context instead of external state management libraries
- **Rationale**: Lightweight solution for this application's scope, no external dependencies
- **Benefits**: Simple setup, good performance for the current feature set

#### 3. Component Composition
- **Decision**: Modular component structure with clear separation of concerns
- **Rationale**: Each component has a single responsibility, making them reusable and testable
- **Benefits**: Easy to maintain, extend, and debug

### UI/UX Decisions

#### 1. Responsive Design
- **Decision**: Mobile-first approach with Tailwind CSS
- **Rationale**: Ensures the application works well on all device sizes
- **Implementation**: Flexible grid layouts, responsive typography, touch-friendly interactions

#### 2. Loading States
- **Decision**: Implemented skeleton loaders and loading indicators
- **Rationale**: Provides better user experience during data fetching
- **Benefits**: Reduces perceived loading time, prevents layout shifts

#### 3. Toast Notifications
- **Decision**: Used React Hot Toast for user feedback
- **Rationale**: Non-intrusive way to provide immediate feedback
- **Benefits**: Users know when actions succeed or fail without page refreshes

### Technical Decisions

#### 1. TypeScript
- **Decision**: Full TypeScript implementation
- **Rationale**: Type safety, better developer experience, fewer runtime errors
- **Benefits**: Catch errors at compile time, better IDE support, self-documenting code

#### 2. Tailwind CSS
- **Decision**: Utility-first CSS framework
- **Rationale**: Rapid development, consistent design system, small bundle size
- **Benefits**: No custom CSS needed, responsive by default, easy to maintain

#### 3. Mock Data Strategy
- **Decision**: JSON-based mock data with service layer simulation
- **Rationale**: Allows development without backend, realistic data structure
- **Benefits**: Easy to replace with real API, consistent data format

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

Built with ❤️ by Mohit using Next.js, TypeScript, and Tailwind CSS
