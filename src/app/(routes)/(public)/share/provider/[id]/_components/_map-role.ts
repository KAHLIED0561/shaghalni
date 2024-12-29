export const mapRole = (role: string, lang: "ar" | string) => {
  const isAr = lang === "ar";
  switch (role) {
    case "FREELANCER":
      return isAr ? "عامل حر" : "Freelancer";
    case "OFFICE":
      return isAr ? "مكتب هندسي" : "Office";
    case "CONTRACTOR":
      return isAr ? "مقاول" : "Contractor";
    default:
      return "";
  }
};
