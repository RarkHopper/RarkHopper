import { Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">RarkHopper.tech</span>
          </a>

          <nav className="hidden md:flex gap-6">
            <a href="#hero" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a
              href="#timeline"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Timeline
            </a>
            <a
              href="#projects"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills-experience"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Skills
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t px-4 py-2">
          <a
            href="#hero"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#timeline"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Timeline
          </a>
          <a
            href="#projects"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Projects
          </a>
          <a
            href="#skills-experience"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Skills
          </a>
          <a
            href="#contact"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
