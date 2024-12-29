import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";

type SearchParamsProviderProps = {
  children: ReactNode;
};

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};
