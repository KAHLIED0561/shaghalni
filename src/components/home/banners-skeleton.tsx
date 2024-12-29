import { Skeleton } from "@/components/ui/skeleton";

const BannersSkeleton = () => {
  return (
    <section className="pt-16 container">
      <div className="relative rounded-2.5xl overflow-hidden">
        <Skeleton className="w-full aspect-[2.75/1] min-h-48" />
      </div>
    </section>
  );
};

export default BannersSkeleton;
