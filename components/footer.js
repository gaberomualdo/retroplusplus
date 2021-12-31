const linkClasses = "text-purple-500 hover:purple-600 hover:underline";
export default function Example() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-center lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400 w-full">
            Built by{" "}
            <a
              className={linkClasses}
              href="https://GabrielRomualdo.com/"
              target="_blank"
            >
              Gabriel Romualdo
            </a>
            . Check out the source code{" "}
            <a
              className={linkClasses}
              href="https://github.com/xtrp/retroplusplus"
              target="_blank"
            >
              on GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
