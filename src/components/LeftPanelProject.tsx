import Markdown from "./Markdown";

export type LeftPanelProjectItem = {
  title: string;
  role?: string;
  date?: string; // Made optional
  descriptions: string[];
};

type Props = {
  section: string;
  roleInline?: boolean;
  items: LeftPanelProjectItem[];
};

export default function LeftPanelProject({
  section,
  roleInline,
  items,
}: Props) {
  return (
    <div>
      <div className="text-lg font-bold text-gray-900 mb-2">{section}</div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <div className="font-semibold text-gray-800 text-sm">
              {item.title}{" "}
              {!roleInline && item.date && (
                <span className="font-normal text-gray-600">({item.date})</span>
              )}
            </div>
            {roleInline && (
              <div className="text-gray-800 text-sm mb-1">
                {item.role}{" "}
                {item.date && (
                  <span className="font-normal text-gray-600">
                    ({item.date})
                  </span>
                )}
              </div>
            )}
            {item.role && (
              <div className="text-gray-800 text-sm mb-1">{item.role}</div>
            )}
            <div className="space-y-1">
              {(item.descriptions ?? []).map((description, descIndex) => (
                <Markdown
                  key={descIndex}
                  className="text-xs text-gray-700 leading-relaxed"
                >
                  {description.trim()}
                </Markdown>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
