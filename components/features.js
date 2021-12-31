import {
  AnnotationIcon,
  ChatAlt2Icon,
  ChatAltIcon,
  CursorClickIcon,
  DocumentReportIcon,
  HeartIcon,
  InboxIcon,
  LightBulbIcon,
  LightningBoltIcon,
  LinkIcon,
  MenuIcon,
  PencilAltIcon,
  QuestionMarkCircleIcon,
  ReplyIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";

const features = [
  {
    name: "Effortless Setup",
    description:
      "Simply click the Start Retro button and you're ready to go. No account sign-up or form required.",
    icon: CursorClickIcon,
  },
  {
    name: "Fast & Realtime",
    description:
      "You can be sure that items in your retrospectives will be synced with your team at all times.",
    icon: LightningBoltIcon,
  },
  {
    name: "Anonymous Feedback",
    description:
      "Items in retrospectives are anonymous to help build a better understanding of your team's performance.",
    icon: UsersIcon,
  },
  {
    name: "Group Similar Items",
    description:
      "Items in retrospectives can be grouped together to help you identify similar points brought up by your team.",
    icon: PencilAltIcon,
  },
  {
    name: "Easily Sharable",
    description:
      "Easily share your a link to retrospective with your team with the instant link copy button.",
    icon: LinkIcon,
  },
  {
    name: "Vote on Items",
    description:
      "Upvote & downvote Items to help your team understand which strengths and weaknesses are most important to discuss.",
    icon: LightBulbIcon,
  },
];

export default function Features() {
  return (
    <div
      className="border-t border-gray-200 bg-gray-50 pt-6 pb-4"
      id="features"
    >
      <div className="max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="transform transition-all px-6 py-8 border border-gray-200 rounded-lg hover:bg-white hover:scale-105 hover:shadow cursor-default"
            >
              <div className="flex justify-center">
                <span className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 bg-opacity-10">
                  <feature.icon
                    className="h-6 w-6 text-purple-600"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-medium text-gray-700 text-center mb-4">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
