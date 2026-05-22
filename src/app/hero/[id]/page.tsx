import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HeroSwitcher } from "@/components/heroes/HeroSwitcher";
import { getHeroVariant, heroVariants } from "@/components/heroes/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return heroVariants.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const variant = getHeroVariant(id);
  return {
    title: variant ? `Hero ${id} — ${variant.name}` : "Hero",
  };
}

export default async function HeroVariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const variant = getHeroVariant(id);
  if (!variant) notFound();

  const Hero = variant.Component;

  return (
    <>
      <Navbar />
      <Hero />
      <HeroSwitcher current={id} />
    </>
  );
}
