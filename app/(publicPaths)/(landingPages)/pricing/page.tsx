"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const PricingPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("monthly");

  const plans = [
    {
      name: "Influencer",
      price: 10000, // $100.00
      description:
        "Perfect for individual content creators and small businesses",
      type: "single",
    },
    {
      name: "Finance",
      price: 15000, // $150.00
      description: "Tailored solutions for financial service providers",
      type: "single",
    },
    {
      name: "Agency",
      price: 20000, // $200.00
      description: "Comprehensive tools for marketing and creative agencies",
      type: "single",
    },
    {
      name: "Corporation",
      price: 25000, // $250.00
      description: "Enterprise-level solutions for large organizations",
      type: "single",
    },
    {
      name: "HoldingsBase",
      price: 5000, // $50.00
      description:
        "Base package for holding companies with multiple subsidiaries",
      type: "holdings",
    },
  ];

  const handleGetStarted = (plan: any) => {
    router.push(`/pricing/plan?plan=${plan.name}&type=${plan.type}`);
  };

  const accordions = [
    {
      name: "SEO",
      content:
        "Our SEO module provides comprehensive tools for optimizing your online presence. Track rankings, analyze competitors, and improve your website's visibility with our advanced analytics and recommendation engine.",
    },
    {
      name: "HR",
      content:
        "Streamline your human resources operations with our HR module. From recruitment to employee management, our tools help you optimize workflows, improve retention, and build a stronger team.",
    },
    {
      name: "Video Editing",
      content:
        "Create professional-grade videos with our intuitive video editing module. Access templates, effects, and AI-powered tools that make content creation faster and more efficient.",
    },
    {
      name: "Content Creation",
      content:
        "Generate engaging content for all your channels with our content creation module. From blog posts to social media captions, our AI assistance helps you maintain consistent quality and voice.",
    },
    {
      name: "Social Media",
      content:
        "Manage all your social media accounts in one place. Schedule posts, analyze performance, and engage with your audience efficiently using our comprehensive social media module.",
    },
  ];

  return (
    <div className="pt-[--sy-320px]">
      <h2 className="font-extrabold text-[--175px] text-[#FFFFFB] text-center mb-[--sy-64px]">
        Pricing
      </h2>
      <div className="flex gap-[--15px] items-center justify-center w-fit mx-auto mb-[--sy-64px]">
        <button
          className={`${
            selected == "monthly"
              ? "text-[#2A2B2A] bg-[#FFFFFB]"
              : "text-[#FFFFFB] bg-transparent"
          } px-[--17px] py-[--sy-11px] rounded-[--3px] cursor-pointer uppercase`}
          onClick={() => setSelected("monthly")}
        >
          monthly
        </button>
        <div className="w-[1px] bg-[#FFFFFB] self-stretch"></div>
        <button
          className={`${
            selected == "Yearly"
              ? "text-[#2A2B2A] bg-[#FFFFFB]"
              : "text-[#FFFFFB] bg-transparent"
          } px-[--17px] py-[--sy-11px] rounded-[--3px] cursor-pointer uppercase`}
          onClick={() => setSelected("Yearly")}
        >
          Yearly
        </button>
      </div>

      <div className="flex flex-wrap gap-[--38px] justify-center w-fit mx-auto mb-[--sy-196px]">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="rounded-[--11px] px-[--38px] py-[--sy-40px] text-[#FFFFFB] group hover:bg-[#FFFFFB] hover:text-[#2A2B2A] min-w-[clamp(25vw,_calc(27.9vw_+_0.1rem),_40vw)]"
          >
            <h3 className="font-extrabold text-[--50px] uppercase mb-[--sy-33px]">
              {plan.name}
            </h3>
            <p className="w-[clamp(14vw,_calc(17vw_+_0.1rem),_25vw)] text-[--22px] mb-[--sy-60px]">
              {plan.description}
            </p>
            <div className="flex flex-col gap-y-[--sy-17px] font-medium text-[--33px] mb-[--sy-60px]">
              <span>
                ${(plan.price / 100).toFixed(2)}
                {selected === "monthly" ? "/month" : "/year"}
              </span>
              <span>
                {plan.type === "holdings"
                  ? "For holding companies"
                  : "Per user"}
              </span>
            </div>
            <button
              className="py-[--sy-17px] w-full uppercase rounded-[--3px] bg-[#FFFFFB] text-[#2A2B2A] group-hover:text-[#FFFFFB] group-hover:bg-[#2A2B2A] text-[--18px] font-semibold"
              onClick={() => handleGetStarted(plan)}
            >
              Get started
            </button>
          </div>
        ))}
      </div>

      <div className="relative w-fit text-[--98px] font-extrabold text-[#FFF] ml-[--98px] mb-[--sy-136px]">
        <h2 className="">Available</h2>
        <h2 className="absolute top-full left-1/4 -translate-y-1/4">Modules</h2>
      </div>
      <p className="ml-auto mb-[--sy-50px] text-[--22px] w-fit text-[#FFFFFB] mr-[--98px]">
        All updates and new modules included
      </p>
      <div className="mx-[--98px] mb-[--sy-196px]">
        {accordions.map((e, i) => {
          return (
            <div
              key={i}
              className={`collapse shadow-[0px_4px_17.7px_0px_#00000040] bg-[#2A2B2A] ${
                i == 0 ? "rounded-none rounded-t-[--9px]" : "rounded-none"
              } text-[#fffffb]`}
            >
              <input
                type="radio"
                name="my-accordion-1"
                defaultChecked={i == 0}
                className="peer py-[--sy-20px]"
              />
              <div className="collapse-title text-xl font-extrabold text-[--98px] peer-hover:bg-[#FFFFFB] peer-hover:text-[#2A2B2A]">
                <h2 className="ml-[--51px] uppercase font-extrabold text-[--98px] py-[--sy-20px]">
                  {e.name}
                </h2>
              </div>
              <div className="collapse-content">
                <p className="text-[--22px] mb-[--sy-50px] mx-[--98px] mt-[--sy-44px]">
                  {e.content}
                </p>
                <Link
                  href={`/modules/${e.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-[#FFFFFB] rounded-[--8px] py-[--sy-20px] px-[--29px] text-[#2A2B2A] text-[--20px] w-fit block ml-auto mr-[--98px] font-bold mb-[--sy-44px]"
                >
                  Check Module
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mx-[--98px] mb-[--sy-196px]">
        <h2 className="text-[--98px] font-extrabold mb-[--sy-80px] text-[#FFFFFB]">
          FAQ
        </h2>
        <div className="text-[#FFFFFB]">
          <div className="flex justify-between pt-[--sy-64px] pb-[--sy-80px] border-b-[1px] border-b-[#FFFFFB] items-center">
            <h5 className="text-[--50px] font-[900] uppercase">
              What's not included <br /> in the pricing?
            </h5>
            <div className="text-[--36px] font-normal">
              <p className="leading-[--sy-40px]">
                One-time Implementation service
              </p>
              <p className="leading-[--sy-40px]">
                (Template creation, Data service, Training, and <br /> access to
                expert services).
              </p>
            </div>
          </div>
          <div className="flex justify-between pt-[--sy-64px] pb-[--sy-80px] border-b-[1px] border-b-[#FFFFFB] items-center">
            <h5 className="text-[--50px] font-[900] uppercase">
              How much does the 1- <br /> time implementation service cost?
            </h5>
            <div className="leading-[--sy-40px] text-[--36px] font-normal">
              <p className="leading-[--sy-40px]">
                Implementation costs vary based on your specific <br /> needs
                and plan. Contact our sales team for a <br /> personalized
                quote.
              </p>
            </div>
          </div>
          <div className="flex justify-between pt-[--sy-64px] pb-[--sy-80px] items-center">
            <h5 className="text-[--50px] font-[900] uppercase">
              Can i freeze my plan if <br /> im not going to use it?
            </h5>
            <div className="leading-[--sy-40px] text-[--36px] font-normal">
              <p className="leading-[--sy-40px]">
                Yes, you can freeze your plan up to three times <br /> per year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
