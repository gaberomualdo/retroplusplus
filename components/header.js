import { newRetro } from "../lib/util";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="/" className="block">
            <span className="sr-only">Retro++</span>
            <img className="h-6 w-auto sm:h-8" src="/logo.png" alt="Retro++" />
          </a>
        </div>
        <div className="flex items-center justify-end md:flex-1 lg:w-0">
          <a
            href="https://github.com/xtrp/retroplusplus"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 font-medium hidden md:block"
          >
            GitHub Repo
          </a>
          <button
            onClick={() => newRetro()}
            className="transition-all ml-8 whitespace-nowrap inline-flex items-center justify-center bg-purple-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-purple-700"
          >
            Start a Retro
          </button>
        </div>
      </div>
    </header>
  );
}
