
export interface ProductEvaluation {
  type: "cane" | "gatto";
  product: string;
  brand: string;
  animal: string;
  grade: string;
  score: number;
  image: string;
  evaluations: Array<{
    name: string;
    status: string;
    color: string;
  }>;
  recommendation: string;
  label: string;
}

export const productEvaluations: ProductEvaluation[] = [
  {
    type: "cane",
    product: "Royal Canin Adult",
    brand: "Royal Canin",
    animal: "Cane adulto, 15kg",
    grade: "A",
    score: 85,
    image: "/lovable-uploads/233a9caf-acb7-4486-8261-786d974aa4a5.png",
    evaluations: [
      { name: "Proteine", status: "Ottimo", color: "green" },
      { name: "Conservanti", status: "Moderato", color: "orange" },
      { name: "Cereali", status: "Adatto", color: "green" }
    ],
    recommendation: "Perfetto per cani adulti di taglia media",
    label: "Adatto per cani adulti"
  },
  {
    type: "gatto",
    product: "Hill's Science Diet",
    brand: "Hill's",
    animal: "Gatto adulto, 4kg",
    grade: "B+",
    score: 78,
    image: "/lovable-uploads/fcc92b02-aaac-410b-a57b-0a36b2439a8b.png",
    evaluations: [
      { name: "Proteine", status: "Buono", color: "blue" },
      { name: "Taurina", status: "Ottimo", color: "green" },
      { name: "Additivi", status: "Moderato", color: "orange" }
    ],
    recommendation: "Ideale per gatti con esigenze nutrizionali specifiche",
    label: "Adatto per gatti adulti"
  }
];

export const getStatusColor = (color: string): string => {
  switch (color) {
    case 'green': return 'text-green-600';
    case 'blue': return 'text-blue-600';
    case 'orange': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};
