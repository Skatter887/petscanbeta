import { cn } from "@/lib/utils";

interface PetScanLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24"
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