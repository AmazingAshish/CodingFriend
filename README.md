# Coding Friend - Ultimate AI Code Companion

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Next.js-15.3.3-lightgrey?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini_2.0_Flash-Powered-orange?style=for-the-badge&logo=google" alt="Gemini 2.0 Flash" />
</div>

<div align="center">
  <h3>🧠 Intelligent Code Conversion & Analysis Platform</h3>
  <p>Transform and analyze code across 35+ programming languages with advanced AI insights powered by Gemini 2.0 Flash</p>
</div>

---

## ✨ Features

### 🔄 **Multi-Language Code Conversion**
- **35+ Programming Languages**: Support for Python, JavaScript, TypeScript, Java, C++, Go, Rust, Swift, Kotlin, PHP, Ruby, Scala, R, MATLAB, Perl, Haskell, Lua, Dart, Elixir, F#, Clojure, Objective-C, Visual Basic, Assembly, Shell, PowerShell, SQL, HTML, CSS, SASS, LESS, Solidity, and WebAssembly
- **Intelligent Translation**: Context-aware code conversion that maintains functionality and follows target language best practices
- **Smart Auto-Detection**: Advanced language detection using pattern matching algorithms
- **Real-time Syntax Highlighting**: Enhanced syntax highlighting with 20+ color schemes and ligature support

### 🔍 **Comprehensive Code Analysis**
- **Detailed Explanations**: Line-by-line breakdown of code logic and functionality
- **Alternative Approaches**: Multiple algorithmic solutions with complexity analysis
- **Performance Metrics**: Big O notation for time and space complexity analysis
- **Code Quality Review**: Comprehensive quality scoring with actionable suggestions
- **Security Analysis**: Vulnerability detection and security recommendations
- **Documentation Review**: Missing documentation detection and improvement suggestions

### 🎨 **Modern User Interface**
- **Advanced Glassmorphism**: Beautiful glass-effect UI with enhanced backdrop blur and gradient borders
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices with touch-friendly interactions
- **Interactive Elements**: Smooth animations, hover effects, and micro-interactions
- **Custom Scrollbars**: Beautifully styled scrollbars with gradient effects and smooth animations
- **Dark Theme**: Eye-friendly dark interface with enhanced contrast and readability
- **Mobile-First Design**: Progressive enhancement from mobile to desktop
- **Enhanced Language Selector**: Professional dropdown with search, keyboard navigation, and proper z-index layering

### ⚡ **Advanced Functionality**
- **Real-time Processing**: Instant code conversion and analysis with Gemini 2.0 Flash
- **Copy & Download**: Easy code sharing and export functionality with automatic file extension detection
- **Expandable Panels**: Full-screen code editing capabilities with keyboard shortcuts
- **Side-by-Side Comparison**: Compare source and converted code simultaneously
- **Conversion History**: Track and revisit previous conversions with detailed metadata
- **Multiple Conversion Modes**: Standard, Optimized, Minimal, and Educational conversion styles
- **File Upload Support**: Direct file upload with automatic language detection
- **Language Swapping**: Quick swap between source and target languages
- **Statistics Dashboard**: Track usage patterns and conversion statistics

### 🚀 **Performance Optimizations**
- **Lazy Loading**: Components and resources loaded on demand
- **Optimized Rendering**: Efficient React rendering with proper memoization
- **Responsive Images**: Adaptive image loading based on device capabilities
- **Code Splitting**: Automatic code splitting for faster initial load times
- **Advanced Caching**: Intelligent caching strategies for improved performance

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES2020+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/coding-friend.git
   cd coding-friend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - The Gemini API key is already configured in the service
   - For production, consider using environment variables

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern React with hooks, concurrent features, and automatic batching
- **Next.js 15.3.3** - Full-stack React framework with server components and file-based routing.
- **TypeScript 5.5.3** - Type-safe development with enhanced IDE support and strict mode

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework with custom configuration
- **ShadCN/UI** - Re-usable components built with Radix UI and Tailwind CSS.
- **Lucide React** - Beautiful, customizable icons with tree-shaking support
- **Framer Motion** - Production-ready motion library for React.

### **AI Integration**
- **Google Gemini 2.0 Flash** - Latest AI model for enhanced code understanding and generation
- **Genkit** - An open source framework from Google to build production-ready AI-powered features.

### **Development Tools**
- **ESLint** - Code linting with TypeScript and React rules
- **PostCSS** - CSS processing with autoprefixer and optimization
- **TypeScript Strict Mode** - Enhanced type checking and error prevention

---

## 📁 Project Structure

```
coding-friend/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages)
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page component
│   ├── components/         # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── code-companion.tsx # Main application logic
│   │   ├── code-editor.tsx # Syntax-highlighted editor
│   │   ├── output-display.tsx # Panel for displaying AI results
│   │   ├── header.tsx      # App header
│   │   └── ...
│   ├── ai/                 # Genkit AI flows and configuration
│   │   ├── flows/          # Genkit flow definitions
│   │   └── genkit.ts       # Genkit initialization
│   ├── lib/                # Utility functions
│   └── hooks/              # Custom React hooks
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🎯 Usage Guide

### **Code Conversion**
1. **Select Source Language**: Choose from 35+ supported programming languages.
2. **Enter Code**: Paste or type your source code.
3. **Select Target Language**: Choose the language you want to convert to.
4. **Convert**: Click the "Run" button to transform your code with AI precision.

### **Code Analysis**
1. **Input Code**: Enter the code you want to analyze in the editor.
2. **Analyze**: Click the "Analyze" tab and then "Run" for comprehensive insights.
3. **Review Results**: Explore detailed explanations for complexity and vulnerabilities.

### **Code Explanation**
1. **Input Code**: Enter the code you want explained.
2. **Explain**: Click the "Explain" tab and then "Run" for a simple explanation.
3. **ELI5 Mode**: Toggle the "Explain Like I'm 5" switch for a super-simple summary.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 🔒 Security

### **API Security**
- API key is handled server-side by Genkit flows.
- Input sanitization for all user inputs should be considered.
- HTTPS enforcement for all API calls.

### **Data Privacy**
- No user data is stored. Code is processed in real-time only.
- No analytics or tracking implemented.
- GDPR compliant by design.

---

## 📄 License

This project is licensed under the MIT License.
