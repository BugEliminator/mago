/** 보관함 탭 */
export type InventoryTab = "skins" | "personas";

export type OwnedSkin = {
  id: string;
  title: string;
  description: string;
  badge: string;
};

export type OwnedPersona = {
  id: string;
  title: string;
  description: string;
  badge: string;
  voiceDesc: string;
};
