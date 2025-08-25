import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useMemo, useState } from "react";

interface Card {
  id: string;
  last4: string;
  type: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
}

interface Partner {
  id: string;
  name: string;
  category: "Food" | "Movies" | "Cafe" | "Other";
  minCredits: number;
}

interface WalletContextValue {
  balance: number;
  cards: Card[];
  transactions: Transaction[];
  carbonCredits: number;
  partners: Partner[];
  redeemCredits: (partnerId: string, credits: number) => { ok: boolean; error?: string };
}

export const [WalletProvider, useWallet] = createContextHook<WalletContextValue>(() => {
  const [balance] = useState<number>(2450);

  const [carbonCredits, setCarbonCredits] = useState<number>(760);

  const [cards] = useState<Card[]>([
    {
      id: "1",
      last4: "4242",
      type: "Visa",
      isDefault: true,
    },
    {
      id: "2",
      last4: "5555",
      type: "Mastercard",
      isDefault: false,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      title: "Added to Wallet",
      date: "Dec 16, 2024",
      amount: 1000,
      type: "credit",
    },
    {
      id: "2",
      title: "Charging Session",
      date: "Dec 15, 2024",
      amount: 678,
      type: "debit",
    },
    {
      id: "3",
      title: "Referral Bonus",
      date: "Dec 14, 2024",
      amount: 200,
      type: "credit",
    },
    {
      id: "4",
      title: "Charging Session",
      date: "Dec 14, 2024",
      amount: 492,
      type: "debit",
    },
  ]);

  const partners = useMemo<Partner[]>(
    () => [
      { id: "vibro-cafe", name: "Vibro Cafe", category: "Cafe", minCredits: 100 },
      { id: "swiggy", name: "Swiggy", category: "Food", minCredits: 150 },
      { id: "zomato", name: "Zomato", category: "Food", minCredits: 150 },
      { id: "bookmyshow", name: "BookMyShow", category: "Movies", minCredits: 200 },
      { id: "district", name: "District", category: "Other", minCredits: 120 },
    ],
    []
  );

  const redeemCredits = useCallback<WalletContextValue["redeemCredits"]>((partnerId, credits) => {
    console.log("redeemCredits called", { partnerId, credits });
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) {
      return { ok: false, error: "Partner not found" };
    }
    if (credits < partner.minCredits) {
      return { ok: false, error: `Minimum ${partner.minCredits} credits required` };
    }
    if (credits > carbonCredits) {
      return { ok: false, error: "Insufficient credits" };
    }

    const newCredits = carbonCredits - credits;
    setCarbonCredits(newCredits);

    const tx: Transaction = {
      id: `${Date.now()}`,
      title: `Carbon Credit Redemption – ${partner.name}`,
      date: new Date().toLocaleDateString(),
      amount: credits,
      type: "debit",
    };
    setTransactions((prev) => [tx, ...prev]);

    return { ok: true };
  }, [carbonCredits, partners]);

  return {
    balance,
    cards,
    transactions,
    carbonCredits,
    partners,
    redeemCredits,
  };
});