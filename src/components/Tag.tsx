import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function Tag({ children }: Props) {
  return (
    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs p-0.5 rounded mr-1 font-mono border border-blue-200">
      {children}
    </span>
  );
}
