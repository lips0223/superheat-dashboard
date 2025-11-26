"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLoginStep, LoginStep, getStepTitle } from "../context/useAuth";
import FistStep from "./FistStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginByPhoneNumber() {
  const {
    currentStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    phoneNumber,
    setPhoneNumber,
  } = useLoginStep();

  const [api, setApi] = useState<CarouselApi>();

  // 当步骤变化时，同步 Carousel 的滑动
  useEffect(() => {
    if (!api) return;

    // currentStep 从 1 开始，但 carousel index 从 0 开始
    const targetIndex = currentStep - 1;
    api.scrollTo(targetIndex);
  }, [currentStep, api]);

  // 自定义的上一步方法：同时更新状态和滑动 Carousel
  const handlePrevStep = () => {
    if (canGoPrev()) {
      prevStep(); // 更新步骤状态
      if (api) {
        api.scrollPrev(); // 滑动 Carousel
      }
    }
  };

  // 自定义的下一步方法：同时更新状态和滑动 Carousel
  const handleNextStep = () => {
    if (canGoNext()) {
      nextStep(); // 更新步骤状态
      if (api) {
        api.scrollNext(); // 滑动 Carousel
      }
    }
  };
  const isBackVisible = currentStep > LoginStep.PHONE_INPUT;
  return (
    <div className="w-full px-8 py-6 bg-white min-h-full">
      <div className="flex justify-between items-center w-full">
        {currentStep > LoginStep.PHONE_INPUT && (
          <div
            className="flex items-center gap-1 cursor-pointer text-base text-[#4b4b4b]"
            onClick={handlePrevStep}
          >
            <Image
              src="/leftBack.svg"
              alt="back"
              width={18}
              height={18}
            ></Image>
            Back
          </div>
        )}

        <div className={`${isBackVisible ? "" : "ml-auto"}`}>
          <div className="text-sm text-[#8e8e8e] text-right font-medium">
            STEP 0{currentStep}/0{LoginStep.COMPLETED - 1}
            <p className="text-[#1f1f1f] text-base">
              {getStepTitle(currentStep).base}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4 text-left w-[320px] m-auto mt-[144px]">
        <h2 className="text-2xl font-medium">
          {getStepTitle(currentStep).title}
        </h2>
        <p className="mt-2 text-[#8e8e8e] text-sm">
          {getStepTitle(currentStep).tip}
        </p>
      </div>
      <Carousel setApi={setApi} className="w-full max-w-xs mx-auto">
        <CarouselContent>
          <CarouselItem>
            <FistStep onNext={handleNextStep} onPrev={handlePrevStep} />
          </CarouselItem>
          <CarouselItem>
            <SecondStep onNext={handleNextStep} onPrev={handlePrevStep} />
          </CarouselItem>
          <CarouselItem>
            <ThirdStep onNext={handleNextStep} onPrev={handlePrevStep}/>
          </CarouselItem>
          {/* <CarouselItem>
            <div className="p-6">
              <h3>完成</h3>
              <p>登录成功！</p>
            </div>
          </CarouselItem> */}
        </CarouselContent>
      </Carousel>

      {/* 自定义的上一步下一步按钮，使用 Carousel API */}
      <div className="flex justify-between mt-4">
        {/* <button
          onClick={handlePrevStep}
          disabled={!canGoPrev()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          上一步
        </button> */}
        {/* <button
          onClick={handleNextStep}
          disabled={!canGoNext()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          下一步
        </button> */}
      </div>
    </div>
  );
}
