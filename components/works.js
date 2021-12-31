const features = [
  {
    name: "Brainstorm",
    description: `Everyone on your team comes up with ideas on what worked well, what to improve, as well as any questions to discuss. Retro items are all anonymous, and in this phase people on the team can only see items they've created, not all others.`,
  },
  {
    name: "Move & Prioritize",
    description:
      "Members of the team can vote on which items they think are most important to discuss. Items that are similar or related can be grouped together for voting and discussion.",
  },
  {
    name: "Discuss & Add Actions",
    description:
      "Now is the time to discuss the items, now auto-sorted by the most votes. You can star an item that is currently being discussed, and check off items after they've been covered. The actions column is now available to add relevant actions for each item.",
  },
  {
    name: "Review",
    description:
      "Now is the time to review the contents of the retro, and save them for future use. Retro++ makes it simple to copy the contents of a retro, as well as share a permanent link with others.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-gray-50 overflow-hidden border-b border-t border-gray-200">
      <div className="mx-auto py-12 px-4 sm:px-12 lg:py-20 lg:px-20 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:mt-0 lg:col-span-7 pr-8">
          <p className="text-3xl font-bold text-gray-900">How It Works</p>
          <p className="mt-3 mb-10 text-lg text-gray-500">
            After you start a retro and share the link with your team, here's
            how it works.
          </p>
          <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:grid-flow-row sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {features.map((feature, i) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute h-10 w-10 bg-purple-500 text-white flex justify-center items-center rounded-full">
                    <p className="text-lg font-light">{i + 1}</p>
                  </div>
                  <p className="ml-14 pt-1 text-xl leading-8 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-14 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hidden lg:flex lg:col-span-3">
          <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
            <img
              className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
              src="/demo.jpg"
              alt="Product demo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
