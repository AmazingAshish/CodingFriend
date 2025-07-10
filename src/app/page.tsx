import { CodeCompanion } from '@/components/code-companion';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
        <CodeCompanion />
      </main>
      <footer className="w-full text-center p-4 text-sm text-muted-foreground">
        Designed and developed by Ashish Kumar with ❤️
      </footer>
    </div>
  );
}
