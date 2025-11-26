import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/slices/useUserSlice";

export default function Complete() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const handlePush = () => {
    console.log("用户状态:", { user, isAuthenticated });
    
    // 检查cookies是否已设置
    const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth-token='));
    const userInfo = document.cookie.split(';').find(c => c.trim().startsWith('user-info='));
    console.log("Cookies状态:", { authToken, userInfo });
    
    // 如果没有cookies，手动设置一下
    if (!authToken && user) {
      document.cookie = `auth-token=${user.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
      const safeUserInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      document.cookie = `user-info=${encodeURIComponent(JSON.stringify(safeUserInfo))}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
      console.log("手动设置了cookies");
    }
    
    // 直接跳转，中间件会检查认证状态
    router.push("/");
  };
  if (!mounted) return null;

  return createPortal(
    <div className="fixed w-full h-[100vh] top-0 left-0 bg-white z-[9999] ">
      <Image
        src="/btc/btc-logo.svg"
        alt="superHeat"
        width={125}
        height={29}
        className="ml-12 mt-10"
      />
      <div className="w-full min-h-screen flex  flex-col mt-[164px] items-center ">
        <Image src="/success.svg" alt="success" height={228} width={320} />
        <div className="mt-6 text-center w-[320px]">
          <p className="text-2xl font-medium text-[#1f1f1f] leading-[32px]">
            You're all set!
          </p>
          <p className="text-sm font-normal text-[#8e8e8e]">
            Your account is now ready. Start managing your operations now
          </p>
        </div>
        <div className="w-[320px]  bg-[#ff6640] rounded-[8px] text-white flex items-center justify-center text-base font-medium mx-auto mt-16 cursor-pointer py-[7px] hover:opacity-90 transition-opacity" onClick={handlePush}  >
          Go to Dashboard
        </div>
      </div>
    </div>,
    document.body
  );
}
