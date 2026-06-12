import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUsers } from './UserContext';
import { supabase } from '../lib/supabase';

export type TransactionType = 
  | 'Survey Reward' 
  | 'Offer Reward' 
  | 'Withdrawal Request' 
  | 'Withdrawal Approval' 
  | 'Withdrawal Rejection' 
  | 'Manual Credit' 
  | 'Manual Debit'
  | 'Chargeback'
  | 'Referral Commission';

export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  providerName?: string;
  withdrawalMethod?: string;
  providerLogo?: string;
  status: TransactionStatus;
  date: string;
  note?: string;
}

export interface UserBalance {
  available: number;
  pending: number;
  lifetime: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  updateTransactionStatus: (id: string, status: TransactionStatus) => Promise<void>;
  balance: UserBalance;
  getUserBalance: (userId: string) => UserBalance;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUsers();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTransactions(data.map(t => ({
        id: t.id,
        userId: t.user_id,
        type: t.type as TransactionType,
        amount: parseFloat(t.amount),
        status: t.status as TransactionStatus,
        date: t.created_at,
        note: t.description,
        providerName: t.provider_name,
        withdrawalMethod: t.withdrawal_method
      })));
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, [currentUser]);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date'>) => {
    console.log("Adding transaction", tx);
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: tx.userId,
        type: tx.type,
        amount: tx.amount,
        description: tx.note,
        status: tx.status,
        withdrawal_method: tx.withdrawalMethod
      })
      .select()
      .single();

    if (error) {
      console.error('Transaction insert error:', error);
      throw error;
    } else {
      console.log('Transaction inserted:', data);
      await refreshTransactions();
    }
  };

  const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
    // Find transaction to check type
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    let newType = tx.type;
    let newStatus = status;
    if (tx.type === 'Withdrawal Request') {
        if (status === 'Approved') {
            newType = 'Withdrawal Approval';
            newStatus = 'Completed'; // The prompt says it should change from Pending to Completed
        }
        else if (status === 'Rejected') {
            newType = 'Withdrawal Rejection';
            // Optionally set newStatus = 'Rejected', but it's passed as 'Rejected' anyway
        }
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ status: newStatus, type: newType })
      .eq('id', id)
      .select();

    if (error) {
       console.error('Update tx error:', error);
    } else {
       console.log('Update tx success:', data);
      await refreshTransactions();
    }
  };

  const getUserBalance = (userId: string) => {
    let available = 0;
    let pending = 0;
    let lifetime = 0;

    transactions.forEach(tx => {
       if (tx.userId !== userId) return;

       if (tx.type === 'Survey Reward' || tx.type === 'Offer Reward' || tx.type === 'Manual Credit' || tx.type === 'Referral Commission') {
           if (tx.status === 'Completed' || tx.status === 'Approved') {
               available += tx.amount;
               lifetime += tx.amount;
           } else if (tx.status === 'Pending') {
               pending += tx.amount;
           }
       } else if (tx.type === 'Withdrawal Request') {
           // Deduct immediately from available balance
           available += tx.amount; // tx.amount is negative
           
           // Show in pending rewards while pending
           if (tx.status === 'Pending') {
               pending += Math.abs(tx.amount);
           }
       } else if (tx.type === 'Withdrawal Approval') {
           // Still deduct from available balance
           available += tx.amount; 
       } else if (tx.type === 'Manual Debit' || tx.type === 'Chargeback') {
           available += tx.amount; // negative
       }
    });

    return { available: Math.max(0, available), pending: Math.max(0, pending), lifetime: Math.max(0, lifetime) };
  };

  const balance = useMemo(() => {
    if (!currentUser) return { available: 0, pending: 0, lifetime: 0 };
    return getUserBalance(currentUser.id);
  }, [transactions, currentUser]);

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransactionStatus, 
      balance, 
      getUserBalance,
      refreshTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
