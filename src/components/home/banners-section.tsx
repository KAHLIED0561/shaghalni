"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { useGetData } from "@/hooks/useFetch";

import BannersSkeleton from "./banners-skeleton";

const BannersSection = () => {
  const endpoint = "/home/banners";
  const { data, isLoading } = useGetData<any>({ endpoint, config: {} });
  const bannersList = data?.status === "success" ? data.response : [];

  if (isLoading) return <BannersSkeleton />;

  return (
    <section className="pt-16 container">
      <Carousel
        dir="ltr"
        plugins={[
          Autoplay({
            delay: 6000,
          }),
        ]}
      >
        <CarouselContent className="-ml-4">
          {bannersList.map((banner: any) => (
            <CarouselItem key={banner.id} className="pl-4">
              <div className="relative w-full aspect-[2.75/1] min-h-48 rounded-2.5xl overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={"banner"}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default BannersSection;
