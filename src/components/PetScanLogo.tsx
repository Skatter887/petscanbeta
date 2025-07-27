import { cn } from "@/lib/utils";

interface PetScanLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-14 h-14", // 12*1.2=14.4 ~ 14
  md: "w-19 h-19", // 16*1.2=19.2 ~ 19
  lg: "w-24 h-24", // 20*1.2=24
  xl: "w-29 h-29"  // 24*1.2=28.8 ~ 29
};

const PetScanLogo = ({ size = "md", className }: PetScanLogoProps) => {
  return (
    <img
      src="/petscan-logo.png"
      alt="PetScan Logo"
      className={cn("object-contain", sizeMap[size], className)}
      style={{ background: '#fff', borderRadius: '16px' }}
      onError={e => { e.currentTarget.style.display = 'none'; }}
    />
  );
};

export default PetScanLogo;