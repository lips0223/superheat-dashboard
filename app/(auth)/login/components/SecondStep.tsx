import { useLoginStep, Temperature } from "../context/useAuth";
import MustImage from "@/components/image/Image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FistStepProps {
  onNext?: () => void;
  onPrev?: () => void;
}
export default function SecondStep({ onNext, onPrev }: FistStepProps) {
  const {
    language,
    setLanguage,
    currencyDisplay,
    setCurrencyDisplay,
    temperatureUnit,
    setTemperatureUnit,
    canGoNext,
    isLoading,
  } = useLoginStep();

  const handleNextStep = () => {
    if (canGoNext() && onNext) {
      onNext();
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Language
          </label>
          <MustImage />
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Currency Display
          </label>
          <MustImage />
        </div>
        <Select value={currencyDisplay} onValueChange={setCurrencyDisplay}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="btc">BTC</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center gap-1">
          <label htmlFor="" className="text-sm font-normal text-[#1f1f1f]">
            Temperature Unit
          </label>
          <MustImage />
        </div>
        <RadioGroup
          value={temperatureUnit}
          className="mt-3"
          onValueChange={(value) => {
            setTemperatureUnit(value as Temperature);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={Temperature.CELSIUS}
              id="r1"
              className="data-[state=checked]:border-[#ff6640]"
              style={
                {
                  "--primary": "#ff6640",
                } as React.CSSProperties
              }
            />
            <Label htmlFor="r1">{`˚C(Celsius)`}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={Temperature.FAHRENHEIT}
              id="r2"
              className="data-[state=checked]:border-[#ff6640]"
              style={
                {
                  "--primary": "#ff6640",
                } as React.CSSProperties
              }
            />
            <Label htmlFor="r2">{`˚F(Fahrenheit)`}</Label>
          </div>
        </RadioGroup>
        <div
          onClick={handleNextStep}
          className={`${
            canGoNext() ? "bg-[#ff6640]" : "bg-[#ffb19e]"
          } w-full rounded-[8px] text-white flex items-center justify-center py-[7px] mt-6 cursor-pointer relative`}
        >
          {isLoading ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
          ) : (
            "Next"
          )}
        </div>
      </div>
    </div>
  );
}
