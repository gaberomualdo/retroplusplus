import { newRetro } from "../lib/util";

export default function CTA() {
  return (
    <div className="bg-purple-700 w-full">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          <span className="block">Ready to Start a Retro?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-purple-200">
          We're excited for you to start using Retro++, a simple and intuitive
          tool for team retrospectives. Start a retrospective now and share the
          link with your team!
        </p>
        <button
          onClick={() => newRetro()}
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 sm:w-auto"
        >
          Start a Retro Now
        </button>
      </div>
    </div>
  );
}
