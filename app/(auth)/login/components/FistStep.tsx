"use client";
import React, { useState } from "react";
import { useLoginStep, SelectPhoneCountryCode } from "../context/useAuth";
import MustImage from "@/components/image/Image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FistStepProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function FistStep({ onNext, onPrev }: FistStepProps) {
  const {
    organization,
    setOrganization,
    phoneNumber,
    setPhoneNumber,
    fullName,
    setFullName,
    canGoNext,
    isLoading,
    isChecked,
    setLoading,
    setIsChecked,
  } = useLoginStep();

  const handleNextStep = () => {
    if(!canGoNext()) return;
    setLoading(true);
    if (canGoNext() && onNext) {
      setLoading(false);
      onNext();
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Organization
          </label>
          <MustImage />
        </div>
        <Input
          className="w-full p-2 pl-0 rounded-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus-visible:border-none placeholder:text-[14px] placeholder:text-[#8e8e8e]"
          value={organization}
          placeholder="ABC Company"
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Your Full Name
          </label>
          <MustImage />
        </div>
        <Input
          value={fullName}
          placeholder="Enter your name"
          className="placeholder:text-[14px] placeholder:text-[#cacaca] foucs-visible:border-none shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 w-full p-2"
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Phone Number
          </label>
          <MustImage />
        </div>
        <div className="flex gap-2">
          <SelectPhoneCountryCode />
          <Input
            value={phoneNumber}
            placeholder="Phone number"
            className="placeholder:text-[14px] placeholder:text-[#cacaca] foucs-visible:border-none shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 w-full p-2"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center  mt-6 justify-between">
        <div className="flex items-center">
          <Checkbox
            className="data-[state=checked]:bg-[#ff6640] data-[state=checked]:border-[#ff6640] data-[state=checked]:text-white"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(!!checked)}
          />
        </div>
        <p className="text-[#4b4b4b] text-sm">
          I agree to the{" "}
          <a className="text-[#ff6640] cursor-pointer underline">
            Terms of Service
          </a>{" "}
          &{" "}
          <a className="text-[#ff6640] cursor-pointer underline">
            Privacy Policy
          </a>
        </p>
      </div>
      <div
        onClick={handleNextStep}
        className={`${
          canGoNext() ? "bg-[#ff6640]" : "bg-[#ffb19e]"
        } w-full rounded-[8px] text-white flex items-center justify-center py-[7px] mt-6 cursor-pointer relative min-h-[40px]`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Next"
        )}
      </div>
    </div>
  );
}
