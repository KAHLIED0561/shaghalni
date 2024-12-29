import { useLocale } from "next-intl";

import { LanguageChangerSelect } from "./select";

export const LanguageChanger = () => {
  const locale = useLocale();

  return (
    <LanguageChangerSelect
      defaultLocale={locale}
      items={[
        { locale: "ar", label: "العربية" },
        { locale: "en", label: "English" },
      ]}
    />
  );
};
