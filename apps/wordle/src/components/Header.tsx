import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <ThemeToggle />
    </header>
  );
}

