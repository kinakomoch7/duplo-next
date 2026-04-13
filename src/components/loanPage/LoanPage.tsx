"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { TotalLoan } from "./TotalLoan";
import { History } from "./History";
import useSWR from "swr";
import { fetcher } from "../common/Fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { SortButton } from "./SortButton";
import { Input } from "../ui/input"; // 検索用
import type { HistoryRecord } from "@/lib/history";

type Props = {
  pageId: string;
};

export const LoanPage = ({ pageId }: Props) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/getHistory/${pageId}`, fetcher);
  const [isAscending, setIsAscending] = useState(false);
  const [searchText, setSearchText] = useState(""); // 検索キーワード
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 検索バーの表示・非表示WEBサイトｗ

  const toggleSortOrder = () => setIsAscending(!isAscending);
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchText("");
  }; // 検索バーをトグル

  const compareHistory = useCallback((a: HistoryRecord, b: HistoryRecord) => {
    const timeDiff = new Date(a.pay_time).getTime() - new Date(b.pay_time).getTime();

    if (timeDiff !== 0) {
      return isAscending ? timeDiff : -timeDiff;
    }

    return isAscending
      ? a.history_id - b.history_id
      : b.history_id - a.history_id;
  }, [isAscending]);

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

    // データを並び替えて検索結果をフィルタリング
    const filteredData = [...(data as HistoryRecord[])]
      .sort(compareHistory)
      .filter((item) =>
        item.note.toLowerCase().includes(searchText.toLowerCase()) // 部分一致・大文字小文字無視
      );

    return filteredData.flatMap((item, index) => {
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
            isIncluded={item.is_included}
          />
        </motion.div>,
      ];
    });
  }, [isLoading, data, compareHistory, searchText, pageId]);

  return (
    <div className="space-y-5 md:space-y-7">
      {/* 支払額 */}
      <section>
        <h2 className="font-bold mt-3 mb-2">支払額</h2>
        <div className="mb-3 text-sm text-muted-foreground">計上対象の履歴のみ集計しています。</div>
        <TotalLoan pageId={pageId} />
      </section>

      {/* 履歴 */}
      <section className="space-y-3">
        <div className="font-bold flex justify-between items-center">
          <span>履歴</span>
          <div className="flex items-center space-x-2">
            <SortButton isAscending={isAscending} onClick={toggleSortOrder} />
            { !isSearchVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={toggleSearch}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={toggleSearch}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        {/* 検索バー */}
        {isSearchVisible && (
          <Input
            type="text"
            placeholder="メモを検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded-md px-2 py-1 w-full mt-2"
          />
        )}

        {renderHistoryList()}
      </section>

      {/* 追加ボタン */}
      <FloatingButtons
        onCreateSingle={() => router.push(`/${pageId}/form`)}
        onCreateBulkInclude={() => router.push(`/${pageId}/include`)}
      />
    </div>
  );
};

const FloatingButtons = ({
  onCreateSingle,
  onCreateBulkInclude,
}: {
  onCreateSingle: () => void;
  onCreateBulkInclude: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="fixed bottom-8 right-6 z-50 flex flex-col gap-3"
  >
    <button
      className="rounded-full bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-lg"
      onClick={onCreateBulkInclude}
    >
      まとめて計上
    </button>
    <button
      className="rounded-full bg-gray-300 px-5 py-5 shadow-lg"
      onClick={onCreateSingle}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </motion.div>
);
