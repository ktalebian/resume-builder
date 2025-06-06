import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  link: string;
  text: string;
};

export default function Href({ icon, link, text }: Props) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700"
      >
        {link.replace("www.", "").replace("https://", "")}
      </a>
    </div>
  );
}
