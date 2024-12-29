import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Review } from "@/schemas/share";

export const ReviewCard = ({ rating, review, autherImage, autherName }: Review) => {
  return (
    <div className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-4 space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={autherImage} alt={autherName} />
          <AvatarFallback>{autherName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold">{autherName}</h3>
          <ul className="flex items-center gap-0.5 cursor-pointer" title={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <StarIcon
                  className={cn(
                    "size-4",
                    rating >= i ? "fill-yellow-400 text-yellow-400" : "fill-gray-400 text-gray-400"
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="font-semibold">{review}</p>
    </div>
  );
};
