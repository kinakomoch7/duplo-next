"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { CopyUrl } from "./CopyUrl";
import { TotalLoan } from "./TotalLoan";
import { History } from "./History";
import useSWR from "swr";
import { fetcher } from "../common/Fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { SortButton } from "./SortButton";

type Props = {
  pageId: string;
};

export const LoanPage = ({ pageId }: Props) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/getHistory/${pageId}`, fetcher);
  const [isAscending, setIsAscending] = useState(false);

  const toggleSortOrder = () => setIsAscending(!isAscending);

  // 日付を YYYY年MM月 のフォーマットに変換
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const renderHistoryList = useCallback(() => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      );
    }
    if (!data || data.length === 0) return <div>履歴がありません</div>;

    let previousMonth = ""; // 前回の履歴の月を保持

    return [...data]
      .sort((a, b) =>
        isAscending
          ? new Date(a.pay_time).getTime() - new Date(b.pay_time).getTime()
          : new Date(b.pay_time).getTime() - new Date(a.pay_time).getTime()
      )
      .flatMap((item, index) => {
        const currentMonth = formatDateHeader(item.pay_time);
        const isNewMonth = currentMonth !== previousMonth;
        previousMonth = currentMonth;

        return [
          isNewMonth && (
            <div key={`month-${currentMonth}`} className="font-medium text-sm mt-3">
              {currentMonth}
            </div>
          ),
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <History
              name={item.payer_name}
              amount={item.pay_amount}
              time={item.pay_time}
              note={item.note}
              historyId={item.history_id}
              pageId={pageId}
            />
          </motion.div>,
        ];
      });
  }, [isLoading, data, isAscending, pageId]);

  return (
    <div className="space-y-5 md:space-y-7">
      {/* 支払額 */}
      <section>
        <h2 className="font-bold mt-3 mb-3">支払額</h2>
        <TotalLoan pageId={pageId} />
      </section>

      {/* 履歴 */}
      <section className="space-y-3">
        <div className="font-bold flex justify-between items-center">
          <span>履歴</span>
          <SortButton isAscending={isAscending} onClick={toggleSortOrder} />
        </div>
        {renderHistoryList()}
      </section>

      {/* 追加ボタン */}
      <FloatingButton onClick={() => router.push(`/${pageId}/form`)} />
    </div>
  );
};

/** 追加ボタン */
const FloatingButton = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="fixed z-50 bottom-8 right-8 py-5 px-5 bg-gray-300 rounded-full cursor-pointer"
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </motion.div>
);
