import { LogOutIcon, ShieldAlertIcon, UserCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";

import { shortenString } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logoutAction } from "@/actions/logout";
import { CurrentUserSchema } from "@/schemas/user";

type UserButtonProps = z.infer<typeof CurrentUserSchema> & {
  lang: string;
};

export const UserButton = ({ name, role, image, lang }: UserButtonProps) => {
  const t = useTranslations("navbar");
  const isCustomer = role === "CUSTOMER";
  const isAr = lang === "ar";

  const handleLogout = async () => {
    await logoutAction();
  };
  return (
    <DropdownMenu modal={false} dir={isAr ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={image as string | undefined} alt={name} />
            <AvatarFallback className="text-primaryClr border border-primaryClr">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{shortenString(name, 10)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-2">
            <p className="bg-primaryClr text-sm text-white px-3 py-1.5 font-medium rounded-md w-fit">
              {role === "ADMIN"
                ? t("admin")
                : role === "OFFICE"
                  ? t("office")
                  : role === "CONTRACTOR"
                    ? t("contractor")
                    : role === "FREELANCER"
                      ? t("freelancer")
                      : role === "CUSTOMER"
                        ? t("customer")
                        : ""}
            </p>
            <h2 className="font-semibold text-base">{name}</h2>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Link href="/profile" className="w-full py-1.5 px-2 flex items-center gap-2 text-gray-700">
              <UserCircle2Icon className="size-5" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link href="/privacy-policy" className="w-full py-1.5 px-2 flex items-center gap-2 text-gray-700">
              <ShieldAlertIcon className="size-5" />
              <span>{t("privacy")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          <button onClick={handleLogout} className="w-full py-1.5 px-2 flex items-center gap-2 text-rose-500">
            <LogOutIcon className="size-5" />
            {t("logout")}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
