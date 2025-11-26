"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { loginWithEmail, checkUserStatus, verifyCode } from "@/service/auth";
import { useSearchParams, useRouter } from "next/navigation";
import LoginByPhoneNumber from "./LoginByPhoneNumber";
import VerifyCode from "./VerifyCode";
import UserInfoForm from "./UserInfoForm";
import { LoginStepProvider } from "../context/useAuth";
import { useUserStore } from "@/store/slices/useUserSlice";
import { handleLoginSuccess } from "@/lib/auth-utils";
import * as ToastPrimitives from "@radix-ui/react-toast";
// import { useToast } from "@/components/hooks/use-toast"
export default function LoginForm() {
  const searchSettings = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Toast状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  
    // zustand状态
  const { 
    emailVerified, 
    isFirstLogin, 
    userEmail, 
    setEmailVerified, 
    setFirstLogin, 
    setUserEmail,
    setUser,
    resetAuthFlow
  } = useUserStore();

  // 显示Toast消息
  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };
  // 验证码成功后的处理
  const handleVerificationSuccess = async (token: string) => {
    try {
      console.log("验证码验证中...");
      
      // 标准 Supabase 流程：验证 OTP
      const verifyResult = await verifyCode({ email, code: token });
      console.log("Verify code response:", verifyResult);
      
      // 从 verifyResult.data 中获取 user（Supabase Auth 返回的用户对象）
      const user = verifyResult.data?.user;
      if (!user || !user.id) {
        throw new Error('验证失败，未获取到用户信息');
      }

      // 使用 user.id 查询用户资料表（只调用一次）
      const statusResult = await checkUserStatus(user.id);
      console.log("Check user status by userId:", statusResult);
      
      if (!statusResult.success || !statusResult.authorized) {
        showToastMessage(statusResult.message || '该用户未被授权', "error");
        setEmailVerified(false);
        setUserEmail(null);
        setIsComposing(false);
        return;
      }

      // 设置邮箱验证成功
      setEmailVerified(true);
      setUserEmail(email);
      setFirstLogin(statusResult.isFirstLogin || false);

      // 如果不是首次登录，直接跳转
      if (!statusResult.isFirstLogin) {
        showToastMessage('登录成功', "success");
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
      
    } catch (error: any) {
      console.error('验证失败:', error);
      showToastMessage(error.message || '验证码错误，请重试', "error");
      setEmailVerified(false);
      setUserEmail(null);
      setIsComposing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    setEmailValid(emailRegex.test(email));
  };
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [nonce, setNonce] = useState(60);

  // 倒计时效果
  useEffect(() => {
    if (isComposing && nonce > 0) {
      const timerId = setTimeout(() => {
        setNonce((prev) => prev - 1);
      }, 1000);
      setTimer(timerId);

      return () => {
        if (timerId) clearTimeout(timerId);
      };
    } else {
      setTimer(null);
    }
  }, [isComposing, nonce]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const handleSetEmailSubmit = async () => {
    try {
      // 标准 Supabase 流程：直接发送验证码
      // Supabase 会自动处理用户是否存在的问题
      console.log("发送验证码到:", email);
      
      const emailResult = await loginWithEmail({ email });
      console.log("Send verification code response:", emailResult);
      
      showToastMessage('验证码已发送到您的邮箱', "success");
      setIsComposing(true);
      setNonce(60); // 重置倒计时
      
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      showToastMessage(error.message || '发送验证码失败，请稍后重试', "error");
    }
  };

  const handleResendEmail = async () => {
    if (nonce === 0) {
      try {
        // 重新发送邮件
        const res = await loginWithEmail({ email });
        console.log("Resend email response:", res);
        setNonce(60); // 重置倒计时
      } catch (error) {
        console.error("Failed to resend email:", error);
        // 可以显示错误提示
      }
    }
  };
  return (
    <>
      {!emailVerified && (
        <div className="w-full h-full px-17.5 flex flex-col items-center">
          <div className="w-full pt-10">
            <Image
              src="/SuperheatConsole.svg"
              alt="superHeat"
              width={215}
              height={32}
            />
            <p className="text-sm text-[#8e8e8e] font-normal pt-1">
              Manage devices, earnings, and operations in one place
            </p>
          </div>

          {!isComposing && (
            <>
              <div className="pt-62.5 flex items-center justify-center w-full flex-col">
                <div className="flex flex-col items-center w-full">
                  <p className="text-2xl font-medium text-[#1f1f1f] gap-2">
                    Welcome
                  </p>
                  <p className="text-sm font-normal text-[#8e8e8e]">
                    Enter your email below to login to your account
                  </p>
                </div>
              </div>
              <div className="w-[320px] pt-6 text-base text-[#1f1f1f] font-normal flex flex-col gap-3">
                <label htmlFor="">Email</label>
                <Input
                  className="px-[7px] py-2.5"
                  placeholder="name@example.com"
                  onChange={handleInputChange}
                ></Input>
                <div
                  className={`mt-3 p-2 flex rounded-[8px] text-white justify-center items-center ${
                    emailValid ? "bg-[#ff6640]" : "bg-[#ffb19e]"
                  } cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={handleSetEmailSubmit}
                >
                  Continue
                </div>
              </div>
            </>
          )}
          {isComposing && (
            <div className="pt-62.5 flex items-center justify-center w-full flex-col">
              <p className="text-2xl font-medium text-[#1f1f1f] gap-2">
                Check Your Email
              </p>
              <p className="text-[#8e8e8e] pt-2">
                Use the verification link sent to your email
              </p>

              <div
                className="text-[#8e8e8e] pt-[2px] flex items-center justify-center cursor-pointer"
                onClick={() => setIsComposing(false)}
              >
                {email}
                <Image
                  src="/Edit.svg"
                  alt="edit"
                  width={16}
                  height={16}
                  className="inline-block ml-2 cursor-pointer"
                ></Image>
              </div>
              <VerifyCode 
                email={email}
                onSuccess={handleVerificationSuccess}
                onBack={() => setIsComposing(false)}
              />
              <div
                className={`pt-6 cursor-pointer ${
                  timer ? "text-[#ff9980]" : "text-[#ff6640]"
                }`}
                onClick={handleResendEmail}
              >
                Didn’t receive a code? Resend {nonce > 0 ? `(${nonce})` : ""}
              </div>
            </div>
          )}

          <div className="text-sm text-center leading-[22px] mt-6">
            <p>Unable to log in? Please contact customer</p>
            <p>service: xxx@email.com</p>
          </div>
        </div>
      )}
      
      {emailVerified && isFirstLogin && (
        <>
          <LoginStepProvider>
            <LoginByPhoneNumber />
          </LoginStepProvider>
        </>
      )}

      {/* Toast 消息提示 */}
      <ToastPrimitives.Provider>
        <ToastPrimitives.Root
          open={showToast}
          onOpenChange={setShowToast}
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 ${
            toastType === "error" 
              ? "bg-red-500 text-white" 
              : "bg-green-500 text-white"
          }`}
        >
          <ToastPrimitives.Title className="font-medium">
            {toastType === "error" ? "错误" : "成功"}
          </ToastPrimitives.Title>
          <ToastPrimitives.Description className="text-sm mt-1">
            {toastMessage}
          </ToastPrimitives.Description>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport />
      </ToastPrimitives.Provider>
    </>
  );
}
