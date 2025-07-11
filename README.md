<div align="center">
  <h1>🧠 Coding Friend</h1>
  <strong>Your Ultimate AI-Powered Code Companion</strong>
  <p>
    An intelligent platform for real-time code conversion, in-depth analysis, and clear explanations across 35+ programming languages.
  </p>
</div>
<div align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Powered_by-Gemini_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini Flash" />
  </a>
</div>

<br/>



---

## ✨ Core Features

Coding Friend is designed to be an indispensable tool for developers, students, and educators. It leverages the power of Google's Gemini 2.0 Flash model to provide unparalleled insights into your code.

### 🔄 **Multi-Language Code Conversion**
- **Broad Language Support**: Seamlessly translate code between 35+ languages, including Python, JavaScript, Java, C++, Go, Rust, and more.
- **Context-Aware Translation**: AI-powered conversion that respects the idiomatic practices and conventions of the target language.
- **Smart Language Detection**: Automatically identifies the source language as you type, streamlining the conversion process.

### 🔍 **Comprehensive Code Analysis**
- **Algorithmic Solutions**: Generates multiple alternative algorithms for a given problem, complete with explanations.
- **Complexity Analysis**: Provides detailed Big O notation for time and space complexity for each solution.
- **Comparison Summary**: Presents a clear, side-by-side table comparing the efficiency of different approaches.

### 🧑‍🏫 **Crystal-Clear Code Explanations**
- **Detailed Walkthroughs**: Get a line-by-line breakdown of your code's logic and functionality.
- **ELI5 Mode**: Simplify complex topics with an "Explain Like I'm 5" mode that uses simple analogies.
- **Vulnerability & Best Practices**: Identifies potential security risks and suggests improvements for more robust, maintainable code.

### 🎨 **Modern & Responsive UI**
- **Sleek Glassmorphism Design**: A beautiful, modern interface that is both intuitive and visually appealing.
- **Responsive & Accessible**: Fully optimized for desktop, tablet, and mobile devices with a focus on accessibility.
- **Light & Dark Modes**: Switch between themes for your comfort, with the system defaulting to your preferred scheme.

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable technology stack.

- **Framework**: [Next.js](https://nextjs.org/) 15.3.3 (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.5.3
- **UI Library**: [React](https://reactjs.org/) 18.3.1
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4.1
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **AI Integration**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/flash/)
- **AI Framework**: [Genkit by Google](https://firebase.google.com/docs/genkit)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these instructions to get a local copy of Coding Friend up and running on your machine.

### Prerequisites
- Node.js v18.0 or later
- npm, yarn, or pnpm package manager

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/coding-friend.git
    cd coding-friend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open Your Browser**
    Navigate to `http://localhost:9002` to see the application in action.

---

## 📁 Project Structure

The codebase is organized following modern Next.js conventions to ensure clarity and maintainability.

```
coding-friend/
├── public/                 # Static assets (fonts, images)
├── src/
│   ├── app/                # Next.js App Router (pages, layout)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # ShadCN UI primitive components
│   │   └── *.tsx           # Core application components
│   ├── ai/                 # Genkit AI flows and configuration
│   │   ├── flows/          # AI logic for conversion, analysis, etc.
│   │   └── genkit.ts       # Genkit initialization
│   ├── lib/                # Utility functions and libraries
│   └── hooks/              # Custom React hooks
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated! If you have an idea for an improvement or have found a bug, please follow these steps:

1.  **Fork the Repository**
2.  **Create a New Branch**: `git checkout -b feature/your-amazing-feature`
3.  **Make Your Changes**: Implement your feature or bug fix.
4.  **Commit Your Changes**: `git commit -m 'feat: Add some amazing feature'`
5.  **Push to the Branch**: `git push origin feature/your-amazing-feature`
6.  **Open a Pull Request**: Provide a clear description of the changes.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
