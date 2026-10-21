import {
  Binary, Braces, Cake, Calculator, Calendar, Clock, Coins, Fingerprint, Files, Hash,
  Heart, Home, Image, Key, Landmark, Lock, Palette, Percent, QrCode, Receipt, Regex,
  Ruler, Table, Text, Timer, TrendingUp, Type, Wallet, Wrench,
  type LucideIcon,
} from "lucide-react";

/** One icon family (Lucide, 1.75 stroke) across the entire site. */
export const iconMap: Record<string, LucideIcon> = {
  binary: Binary, braces: Braces, cake: Cake, calculator: Calculator, calendar: Calendar,
  clock: Clock, coins: Coins, fingerprint: Fingerprint, files: Files, hash: Hash,
  heart: Heart, home: Home, image: Image, key: Key, landmark: Landmark, lock: Lock,
  palette: Palette, percent: Percent, qr: QrCode, receipt: Receipt, regex: Regex,
  ruler: Ruler, table: Table, text: Text, timer: Timer, trending: TrendingUp,
  type: Type, wallet: Wallet,
};

export const getIcon = (key: string): LucideIcon => iconMap[key] ?? Wrench;
