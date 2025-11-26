'use client';

import React, { useState } from 'react';
import { saveUserInfo } from '@/service/auth';
import { useUserStore } from '@/store/slices/useUserSlice';
import { handleLoginSuccess } from '@/lib/auth-utils';
import * as ToastPrimitives from "@radix-ui/react-toast";

interface UserInfoFormProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface UserInfo {
  name: string;
  phone: string;
  company: string;
}

export default function UserInfoForm({ email, onSuccess, onCancel }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // zustand store
  const { setUser } = useUserStore();

  // Toast状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // 显示Toast消息
  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userInfo.name.trim() || !userInfo.phone.trim() || !userInfo.company.trim()) {
      showToastMessage('请填写所有必填字段', "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await saveUserInfo({
        email,
        name: userInfo.name.trim(),
        phone: userInfo.phone.trim(),
        company: userInfo.company.trim()
      });
      if (!response.success || !response.data.success) {
        const errorMessage = response.data.message || '保存用户信息失败';
        showToastMessage(errorMessage, "error");
        return;
      }

      showToastMessage('用户信息保存成功', "success");
      
      // 创建完整的用户对象
      const completeUserInfo = {
        id: Date.now().toString(),
        name: userInfo.name.trim(),
        email: email,
        token: `token_${Date.now()}`, // 临时token，实际应用中应该从后端获取
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      };
      
      // 设置用户状态（这会自动设置cookies）
      setUser(completeUserInfo);
      
      setTimeout(() => {
        // 使用工具函数处理登录成功
        handleLoginSuccess(completeUserInfo);
      }, 1500);
    } catch (error) {
      console.error('保存用户信息失败:', error);
      showToastMessage('网络错误，请稍后重试', "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-[320px] pt-6 text-base text-[#1f1f1f] font-normal flex flex-col gap-3">
            <label className="text-sm text-[#8e8e8e]">步骤 1/3: 姓名</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="px-[7px] py-2.5 border border-[#e0e0e0] rounded-[8px] focus:outline-none focus:border-[#ff6640]"
              placeholder="请输入您的姓名"
              maxLength={50}
            />
            <button
              onClick={handleNext}
              disabled={!userInfo.name.trim()}
              className={`mt-3 p-2 flex rounded-[8px] text-white justify-center items-center ${
                userInfo.name.trim()
                  ? "bg-[#ff6640] cursor-pointer"
                  : "bg-[#ccc] cursor-not-allowed"
              }`}
            >
              下一步
            </button>
          </div>
        );

      case 2:
        return (
          <div className="w-[320px] pt-6 text-base text-[#1f1f1f] font-normal flex flex-col gap-3">
            <label className="text-sm text-[#8e8e8e]">步骤 2/3: 联系电话</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="px-[7px] py-2.5 border border-[#e0e0e0] rounded-[8px] focus:outline-none focus:border-[#ff6640]"
              placeholder="请输入您的联系电话"
              maxLength={20}
            />
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="flex-1 p-2 border border-[#e0e0e0] rounded-[8px] text-[#666] text-center"
              >
                上一步
              </button>
              <button
                onClick={handleNext}
                disabled={!userInfo.phone.trim()}
                className={`flex-1 p-2 rounded-[8px] text-white text-center ${
                  userInfo.phone.trim()
                    ? "bg-[#ff6640] cursor-pointer"
                    : "bg-[#ccc] cursor-not-allowed"
                }`}
              >
                下一步
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-[320px] pt-6 text-base text-[#1f1f1f] font-normal flex flex-col gap-3">
            <label className="text-sm text-[#8e8e8e]">步骤 3/3: 公司名称</label>
            <input
              type="text"
              value={userInfo.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="px-[7px] py-2.5 border border-[#e0e0e0] rounded-[8px] focus:outline-none focus:border-[#ff6640]"
              placeholder="请输入您的公司名称"
              maxLength={100}
            />
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="flex-1 p-2 border border-[#e0e0e0] rounded-[8px] text-[#666] text-center"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userInfo.company.trim() || isSubmitting}
                className={`flex-1 p-2 rounded-[8px] text-white text-center ${
                  userInfo.company.trim() && !isSubmitting
                    ? "bg-[#ff6640] cursor-pointer"
                    : "bg-[#ccc] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? '保存中...' : '完成'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 进度指示器 */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step <= currentStep 
                ? 'bg-[#ff6640] text-white' 
                : 'bg-[#e0e0e0] text-[#999]'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-8 h-0.5 ${
                step < currentStep ? 'bg-[#ff6640]' : 'bg-[#e0e0e0]'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStep()}

      <button
        onClick={onCancel}
        className="mt-4 text-sm text-[#8e8e8e] underline cursor-pointer"
      >
        取消
      </button>

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
    </div>
  );
}