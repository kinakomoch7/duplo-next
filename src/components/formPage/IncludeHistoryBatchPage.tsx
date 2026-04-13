"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { fetcher } from "../common/Fetcher";
import type { HistoryRecord } from "@/lib/history";

export const IncludeHistoryBatchPage = () => {
  const router = useRouter();
  const { pageId } = useParams<{ pageId: string }>();
  const { data, isLoading } = useSWR(`/api/getHistory/${pageId}`, fetcher);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const excludedHistories = useMemo(
    () => ((data as HistoryRecord[] | undefined) ?? []).filter((history) => !history.is_included),
    [data]
  );

  const toggleHistory = (historyId: number, checked: boolean) => {
    setSelectedHistoryIds((currentIds) =>
      checked
        ? [...currentIds, historyId]
        : currentIds.filter((currentId) => currentId !== historyId)
    );
  };

  const submitHandler = async () => {
    setErrorMessage("");

    if (selectedHistoryIds.length === 0) {
      setErrorMessage("計上対象に戻す履歴を選んでください");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/includeHistoryBatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageId,
        historyIds: selectedHistoryIds,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      router.push(`/${pageId}`);
      return;
    }

    setErrorMessage("まとめて計上に失敗しました");
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">履歴を読み込み中です...</div>;
  }

  if (excludedHistories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          現在、計上対象外の履歴はありません。
        </div>
        <Button type="button" onClick={() => router.push(`/${pageId}`)}>
          一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        計上対象外の履歴から、まとめて計上対象に戻す履歴を選択できます。
      </div>

      <div className="space-y-3">
        {excludedHistories.map((history) => {
          const checked = selectedHistoryIds.includes(history.history_id);

          return (
            <Card key={history.history_id} className="p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={checked}
                  onChange={(event) => toggleHistory(history.history_id, event.target.checked)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{history.payer_name}</div>
                    <div>{history.pay_amount.toLocaleString()}円</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{history.note}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(history.pay_time).toLocaleDateString()}
                  </div>
                </div>
              </label>
            </Card>
          );
        })}
      </div>

      {errorMessage ? <div className="text-sm text-red-500">{errorMessage}</div> : null}

      <Button type="button" onClick={submitHandler} disabled={isSubmitting}>
        {isSubmitting ? "更新中..." : "選択した履歴を計上に含める"}
      </Button>
    </div>
  );
};
