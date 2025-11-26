import MustImage from "@/components/image/Image";
import { Input } from "@/components/ui/input";
import { useLoginStep } from "../context/useAuth";
import Complete from "./Complete";
import { delay } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/slices/useUserSlice";
interface FistStepProps {
  onNext?: () => void;
  onPrev?: () => void;
}
export default function ThirdStep({ onNext, onPrev }: FistStepProps) {
  const {
    walletAddress,
    setWalletAddress,
    walletName,
    setWalletName,
    canGoNext,
    isLoading,
    setLoading,
    setIsComplete,
    isComplete,
    fullName,
    phoneNumber,
    organization,
  } = useLoginStep();
  
  const { setUser, userEmail } = useUserStore();
  const router = useRouter();
  // BTC 钱包地址验证函数
  const isValidBTCAddress = (address: string): boolean => {
    // Legacy address (P2PKH): 以 1 开头，25-34 字符
    const legacyRegex = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    // SegWit address (P2SH): 以 3 开头，25-34 字符  
    const segwitP2SHRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    // Native SegWit address (Bech32): 以 bc1 开头
    const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
    
    // Taproot address (Bech32m): 以 bc1p 开头
    const taprootRegex = /^bc1p[a-z0-9]{58}$/;
    
    return legacyRegex.test(address) || 
           segwitP2SHRegex.test(address) || 
           bech32Regex.test(address) || 
           taprootRegex.test(address);
  };

  const handleNextStep = async () => {
    if (!isValidBTCAddress(walletAddress)) {
      alert("请输入有效的 Bitcoin 钱包地址");
      return;
    }
    
    setLoading(true);
    await delay(2000);
    setLoading(false);
    
    // 创建完整的用户对象
    const userInfo = {
      id: Date.now().toString(),
      name: fullName || '用户', // 使用填写的姓名
      email: userEmail || 'user@example.com', // 使用验证过的邮箱
      token: `token_${Date.now()}`, // 临时token，实际应用中应该从后端获取
      role: 'user' as const,
      phone: phoneNumber,
      organization: organization,
      walletAddress: walletAddress,
      createdAt: new Date().toISOString(),
    };
    
    console.log("创建用户对象:", userInfo);
    
    // 设置用户状态（这会自动设置cookies）
    setUser(userInfo);
    
    console.log("设置 isComplete 为 true");
    setIsComplete(true);
  };
  return (
    <div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Wallet Address
          </label>
          <MustImage />
        </div>
        <Input
          className="shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Wallet Name
          </label>
        </div>
        <Input
          className="shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between  mt-6 w-full gap-4">
        <div className="flex-1 flex items-center justify-center cursor-pointer py-[7px] border border-[#e1e1e1] rounded-[8px] min-h-[38px]" 
        onClick={() => router.push('/dashboard')}
        >
          Skip for now
        </div>
        <div
          onClick={handleNextStep}
          className={`${
            canGoNext() ? "bg-[#ff6640]" : "bg-[#ffb19e]"
          } flex-1 rounded-[8px] text-white flex items-center justify-center py-[7px] cursor-pointer relative min-h-[38px]`}
        >
          {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Verify"
          )}
        </div>
      </div>
      {/* 调试：isComplete = {isComplete ? 'true' : 'false'} */}
      {isComplete && <Complete />}
    </div>
  );
}
