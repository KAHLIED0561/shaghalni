import { MailCheck } from "lucide-react";

export const FormSuccess = ({ successes }: { successes: string[] }) => {
  if (successes.length === 0) return null;
  return (
    <div className="w-full bg-emerald-50 border rounded border-emerald-500 p-2">
      <ul className="space-y-0.5">
        {successes.map((success, index) => (
          <li key={index} className="flex gap-2 items-center text-sm text-emerald-500">
            <MailCheck className="size-4" />
            <span>{success}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
