export type UpgradeProduct = {
  id: string;
  name: string;
  internalName: string;
  description: string | null;
  amount: number;
  currency: string;
  accent: string;
  priceId: string | null;
  recurring?: string;
  icon?: React.ReactNode;
  owned: boolean;
};
