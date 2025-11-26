"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 定义登录步骤的类型
export enum LoginStep {
  PHONE_INPUT = 1, // 输入手机号
  PERFERENCES = 2, // 偏好设置
  WALLET = 3, // 绑定钱包
  COMPLETED = 4, // 登录完成
}

//定义温度便好枚举
export enum Temperature {
  CELSIUS = "celsius", // 摄氏度
  FAHRENHEIT = "frahenheit", // 华氏度
}
// Context 的数据类型
interface LoginStepContextType {
  currentStep: LoginStep;
  phoneNumber: string;
  countryCode: string;
  organization: string;
  fullName: string;
  isChecked?: boolean;
  language: string;
  currencyDisplay: string;
  temperatureUnit: Temperature;
  walletAddress: string;
  walletName?: string;
  isLoading: boolean;
  error: string | null;

  // 步骤控制方法
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: LoginStep) => void;
  isComplete?: boolean;

  // 数据更新方法
  setPhoneNumber: (phone: string) => void;
  setCountryCode: (code: string) => void;
  setOrganization: (org: string) => void;
  setFullName: (name: string) => void;
  setLanguage: (lang: string) => void;
  setCurrencyDisplay: (currency: string) => void;
  setTemperatureUnit: (unit: Temperature) => void;
  setWalletAddress: (address: string) => void;
  setWalletName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsChecked: (checked: boolean) => void;
  setIsComplete: (complete: boolean) => void;
  updateField: <
    K extends keyof {
      organization: string;
      fullName: string;
      language: string;
      currencyDisplay: string;
      temperatureUnit: Temperature;
      walletAddress: string;
      walletName: string | undefined;
      countryCode: string;
    }
  >(
    key: K,
    value: {
      organization: string;
      fullName: string;
      language: string;
      currencyDisplay: string;
      temperatureUnit: Temperature;
      walletAddress: string;
      walletName: string | undefined;
      countryCode: string;
    }[K]
  ) => void;
  // 重置方法
  resetLoginFlow: () => void;

  // 步骤验证
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
}

// 创建 Context
const LoginStepContext = createContext<LoginStepContextType | undefined>(
  undefined
);

// Provider Props
interface LoginStepProviderProps {
  children: ReactNode;
  initialStep?: LoginStep;
}

// Provider 组件
export const LoginStepProvider: React.FC<LoginStepProviderProps> = ({
  children,
  initialStep = LoginStep.PHONE_INPUT,
}) => {
  const [currentStep, setCurrentStep] = useState<LoginStep>(initialStep);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("US");
  const [organization, setOrganization] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currencyDisplay, setCurrencyDisplay] = useState<string>("usd");
  const [temperatureUnit, setTemperatureUnit] = useState<Temperature>(
    Temperature.CELSIUS
  );
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string | undefined>(undefined);

  // 统一数据更新方法
  const updateField = <
    K extends keyof {
      organization: string;
      fullName: string;
      language: string;
      currencyDisplay: string;
      temperatureUnit: Temperature;
      walletAddress: string;
      walletName: string | undefined;
      countryCode: string;
    }
  >(
    key: K,
    value: {
      organization: string;
      fullName: string;
      language: string;
      currencyDisplay: string;
      temperatureUnit: Temperature;
      walletAddress: string;
      walletName: string | undefined;
      countryCode: string;
    }[K]
  ) => {
    switch (key) {
      case "organization":
        setOrganization(value as string);
        break;
      case "fullName":
        setFullName(value as string);
        break;
      case "language":
        setLanguage(value as string);
        break;
      case "currencyDisplay":
        setCurrencyDisplay(value as string);
        break;
      case "temperatureUnit":
        setTemperatureUnit(value as Temperature);
        break;
      case "walletAddress":
        setWalletAddress(value as string);
        break;
      case "walletName":
        setWalletName(value as string | undefined);
        break;
      case "countryCode":
        setCountryCode(value as string);
        break;
      default:
        break;
    }
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 步骤控制方法
  const nextStep = () => {
    if (canGoNext()) {
      setCurrentStep((prev) => Math.min(prev + 1, LoginStep.COMPLETED));
      setError(null); // 清除错误信息
    }
  };

  const prevStep = () => {
    if (canGoPrev()) {
      setCurrentStep((prev) => Math.max(prev - 1, LoginStep.PHONE_INPUT));
      setError(null); // 清除错误信息
    }
  };

  const goToStep = (step: LoginStep) => {
    setCurrentStep(step);
    setError(null);
  };

  // 数据更新方法
  const updatePhoneNumber = (phone: string) => {
    setPhoneNumber(phone);
    setError(null); // 清除错误信息
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const updateError = (error: string | null) => {
    setError(error);
  };

  // 重置整个登录流程
  const resetLoginFlow = () => {
    setCurrentStep(LoginStep.PHONE_INPUT);
    setPhoneNumber("");
    setCountryCode("US");
    setOrganization("");
    setFullName("");
    setLanguage("");
    setCurrencyDisplay("");
    setTemperatureUnit(Temperature.CELSIUS);
    setWalletAddress("");
    setWalletName(undefined);
    setIsLoading(false);
    setError(null);
  };

  // 步骤验证
  const canGoNext = (): boolean => {
    switch (currentStep) {
      case LoginStep.PHONE_INPUT:
        // 验证手机号格式（简单验证）
        return (
          phoneNumber.length >= 10 &&
          isChecked &&
          fullName.trim() !== "" &&
          organization.trim() !== "" &&
          !isLoading
        );
      case LoginStep.PERFERENCES:
        // 需要填写 organization, fullName, language, currencyDisplay
        return (
          organization.trim() !== "" &&
          fullName.trim() !== "" &&
          language.trim() !== "" &&
          currencyDisplay.trim() !== "" &&
          temperatureUnit.trim() !== "" &&
          !isLoading
        );
      case LoginStep.WALLET:
        // 需要填写 walletAddress
        return walletAddress.trim() !== "" && !isLoading;
      case LoginStep.COMPLETED:
        return false; // 已完成，不能再前进
      default:
        return false;
    }
  };

  const canGoPrev = (): boolean => {
    return currentStep > LoginStep.PHONE_INPUT && !isLoading;
  };

  // Context 值
  const contextValue: LoginStepContextType = {
    currentStep,
    phoneNumber,
    countryCode,
    organization,
    fullName,
    language,
    currencyDisplay,
    temperatureUnit,
    walletAddress,
    walletName,
    isChecked,
    isComplete,
    setCountryCode,
    setOrganization,
    setFullName,
    setLanguage,
    setCurrencyDisplay,
    setTemperatureUnit,
    setWalletAddress,
    setWalletName,
    setIsChecked,
    setIsComplete,
    updateField,
    isLoading,
    error,

    nextStep,
    prevStep,
    goToStep,

    setPhoneNumber: updatePhoneNumber,
    setLoading,
    setError: updateError,
    resetLoginFlow,

    canGoNext,
    canGoPrev,
  };

  return (
    <LoginStepContext.Provider value={contextValue}>
      {children}
    </LoginStepContext.Provider>
  );
};

// 自定义 Hook
export const useLoginStep = (): LoginStepContextType => {
  const context = useContext(LoginStepContext);
  if (context === undefined) {
    throw new Error("useLoginStep must be used within a LoginStepProvider");
  }
  return context;
};
export interface StepTitle {
  title: string;
  tip?: string;
  base?: string;
}
// 导出步骤常量和工具函数
export const getStepTitle = (step: LoginStep): StepTitle => {
  switch (step) {
    case LoginStep.PHONE_INPUT:
      return {
        title: "Welcome!",
        tip: "Enter your name and phone number to complete your profile and improve service management.",
        base: "Basic Info.",
      };
    case LoginStep.PERFERENCES:
      return {
        title: "Set Your Preferences",
        tip: "Customize how you want to view information. You can change these settings anytime in Settings.",
        base: "Preferences",
      };
    case LoginStep.WALLET:
      return {
        title: "Set up Your Wallet",
        tip: "Add your Bitcoin wallet address to receive earnings directly. You can skip this step and set it up later in Earnings & Finance.",
        base: "Financial settings",
      };
    case LoginStep.COMPLETED:
      return {
        title: "",
      };
    default:
      return {
        title: "未知步骤",
      };
  }
};

export const getStepDescription = (step: LoginStep): string => {
  switch (step) {
    case LoginStep.PHONE_INPUT:
      return "请输入您的手机号码";
    case LoginStep.PERFERENCES:
      return "设置您的个人偏好";
    case LoginStep.WALLET:
      return "绑定您的钱包地址";
    case LoginStep.COMPLETED:
      return "登录成功，正在跳转...";
    default:
      return "";
  }
};
// 国家代码数据类型
interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

// 常用国家代码数据
const COUNTRY_CODES: CountryCode[] = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
];

// 手机号国家代码选择器组件
export const SelectPhoneCountryCode = ({
  className = "",
}: {
  className?: string;
}) => {
  const { countryCode, setCountryCode } = useLoginStep();

  const getCurrentCountry = () => {
    return (
      COUNTRY_CODES.find((country) => country.code === countryCode) ||
      COUNTRY_CODES[0]
    );
  };

  return (
    <Select value={countryCode} onValueChange={setCountryCode}>
      <SelectTrigger
        className={`w-[140px] flex items-center gap-2 border-gray-300 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCurrentCountry().flag}</span>
          <span className="font-medium text-sm">
            {getCurrentCountry().dialCode}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_CODES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{country.flag}</span>
              <span className="font-medium">{country.dialCode}</span>
              <span className="text-sm text-gray-600">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default LoginStepProvider;
