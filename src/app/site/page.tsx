import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col bg-black">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <p className="text-center text-primary">Run your agency in one place!</p>

        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">WebPress</h1>
        </div>

        <div className="flex just0fy-center items-center relative md:mt-[-70px]">
          <Image
            src={'/assets/preview-image.png'}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-t-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center flex-col gap-4 md:mt-24 mt-5">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straight forward pricing plans are tailored to meet your needs. If {" you're"} not <br /> ready to commit you can get started for free
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            //TODO: Wire up free products from stripe
            <Card key={card.title} className={clsx('w-[300px] flex flex-col justify-between', { 'border-2 border-primary': card.title === 'Unlimited SAAS', })}>
              <CardHeader>
                <CardTitle className={clsx('', {
                  'text-muted-foreground': card.title !== 'Unlimited SAAS'
                })}>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">/month</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>{card.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Check className="text-primary" />
                    <p>{feature}</p>
                  </div>
                ))}</div>
                <Link href={`/agency?plans=${card.priceId}`} className={clsx('w-full text-center  bg-primary p-2 rounded-md', { '!bg-muted-foreground': card.title !== 'Unlimited SAAS'})}>
                Get Started</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
