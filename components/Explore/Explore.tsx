export type ExploreProps = {
  recent: { id: string; name: string }[];
};

const Explore = ({ recent }: ExploreProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold py-4">Recent Quiz</h1>
      {recent.map((topic) => {
        return (
          <a key={topic.id} className="link" href={`/topic/${topic.id}`}>
            {topic.name}
          </a>
        );
      })}
    </div>
  );
};

export default Explore;
