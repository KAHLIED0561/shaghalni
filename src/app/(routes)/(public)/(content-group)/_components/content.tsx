type ContentProps = {
  content: string;
};

export const Content = ({ content }: ContentProps) => {
  return <section className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-6">{content}</section>;
};
