"use client";

import React, { useState, useEffect } from "react";
import { sendVerificationCode, verifyCode } from "@/service/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import * as ToastPrimitives from "@radix-ui/react-toast"
interface VerifyCodeProps {
  email: string;
  onSuccess?: (token: string) => void;
  onBack?: () => void;
}

export default function VerifyCode({ email, onSuccess, onBack }: VerifyCodeProps) {
  const [value, setValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 倒计时效果
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  // 验证码输入完成后自动验证
  useEffect(() => {
    if (value.length === 6) {
      handleVerifyCode();
    }
  }, [value]);

  const handleVerifyCode = async () => {
    if (value.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const result = await verifyCode({ email, code: value });
      
      console.log("验证码验证结果:", result);
      
      // request服务返回ApiResponse格式，数据在data字段中
      if (result.success) {
        // 显示成功Toast
        setShowToast(true);
        
        // 调用成功回调，不再跳转URL
        setTimeout(() => {
          onSuccess?.(result.data?.token || 'success');
        }, 1000);
      } else {
        setError(result.message || "验证失败，请重试");
        setValue(""); // 清空输入
      }
    } catch (error: any) {
      console.error("验证码验证错误:", error);
      setError(error.response?.data?.message || error.message || "验证失败，请重试");
      setValue("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (isTimerActive || isResending) return;

    setIsResending(true);
    setError("");

    try {
      const result = await sendVerificationCode({ email });
      
      console.log("重发验证码结果:", result);
      
      if (result.success) {
        setTimer(60);
        setIsTimerActive(true);
        setValue("");
      } else {
        setError(result.message || "重发失败，请稍后重试");
      }
    } catch (error: any) {
      console.error("重发验证码错误:", error);
      setError(error.response?.data?.message || error.message || "重发失败，请稍后重试");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full flex-col">
      {/* 验证码输入区域 */}
      <div className="w-full max-w-[400px] mt-6">
        <div className="flex justify-center">
          <InputOTP 
            maxLength={6} 
            value={value} 
            onChange={(value) => setValue(value)}
            className={error ? "border-red-400" : ""}
          >
            <InputOTPGroup>
              <InputOTPSlot 
                index={0} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-l-[6px] rounded-r-none"
              />
              <InputOTPSlot 
                index={1} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-r-[6px] rounded-l-none -ml-[1px]"
              />
            </InputOTPGroup>
            
            <InputOTPSeparator className="text-[#0A0A0A] mx-3" />
            
            <InputOTPGroup>
              <InputOTPSlot 
                index={2} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-l-[6px] rounded-r-none"
              />
              <InputOTPSlot 
                index={3} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-r-[6px] rounded-l-none -ml-[1px]"
              />
            </InputOTPGroup>
            
            <InputOTPSeparator className="text-[#0A0A0A] mx-3" />
            
            <InputOTPGroup>
              <InputOTPSlot 
                index={4} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-l-[6px] rounded-r-none"
              />
              <InputOTPSlot 
                index={5} 
                className="w-12 h-12 text-lg border-2 data-[active=true]:border-[#fc6640] data-[active=true]:ring-[#fc6640]/16 data-[active=true]:ring-[3px] rounded-r-[6px] rounded-l-none -ml-[1px]"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="mt-3 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* 验证状态 */}
        {isVerifying && (
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#ff6640] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[#8e8e8e]">正在验证...</span>
            </div>
          </div>
        )}
      </div>

      {/* 重发验证码 */}
      {/* <div className="mt-6 text-center">
        <p className="text-sm text-[#8e8e8e] mb-2">Didn't receive a code?</p>
        <button
          onClick={handleResendCode}
          disabled={isTimerActive || isResending}
          className={`text-sm font-medium transition-colors ${
            isTimerActive || isResending
              ? "text-[#ffb19e] cursor-not-allowed"
              : "text-[#ff6640] hover:text-[#e55a36] cursor-pointer"
          }`}
        >
          {isResending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-[#ff6640] border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </span>
          ) : isTimerActive ? (
            `Resend (${timer}s)`
          ) : (
            "Resend code"
          )}
        </button>
      </div> */}

      {/* Toast 成功提示 */}
      <ToastPrimitives.Provider>
        <ToastPrimitives.Root
          open={showToast}
          onOpenChange={setShowToast}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2"
        >
          <ToastPrimitives.Title className="font-medium">
            验证成功！
          </ToastPrimitives.Title>
          <ToastPrimitives.Description className="text-sm mt-1">
            正在跳转到绑定钱包页面...
          </ToastPrimitives.Description>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport />
      </ToastPrimitives.Provider>
    </div>
  );
}
