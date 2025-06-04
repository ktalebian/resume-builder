import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
  className?: string;
};

export default function Markdown({ children, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <span>{children}</span>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">
              {children}
            </code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
