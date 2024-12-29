import { AlertTriangle } from "lucide-react";

export const FormErrors = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  return (
    <div className="w-full bg-rose-50 border rounded border-rose-500 p-2">
      <ul className="space-y-0.5">
        {errors.map((error, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-rose-500">
            <AlertTriangle className="size-4" />
            <span>{error}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
