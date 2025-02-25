"use client";

import { useState, useMemo } from "react";
import { Card } from "../ui/card";
import { fetcher } from "../common/Fetcher";
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

type Props = {
  pageId: string;
};

export const TotalLoan = ({ pageId }: Props) => {
  const [standard, setStandard] = useState<string>("average");

  const { data, error, isLoading } = useSWR(`/api/getHistory/${pageId}`, fetcher);

  const selectHandler = (value: string) => {
    setStandard(value);
  };

  // データが取得できない場合の処理（フックの順番を守る）
  const formatData = useMemo(() => {
    if (!data || isLoading) return []; // isLoading の場合は空の配列を返す
    return data.reduce((acc: any, record: any) => {
      const isRecord = acc.find((item: any) => item.payer_name === record.payer_name);
      if (isRecord) {
        isRecord.pay_amount += record.pay_amount;
      } else {
        acc.push({ payer_name: record.payer_name, pay_amount: record.pay_amount });
      }
      return acc;
    }, []);
  }, [data, isLoading]);

  const averageAmount = useMemo(() => {
    if (formatData.length === 0) return 0;
    return parseFloat(
      (formatData.reduce((acc: any, record: any) => acc + record.pay_amount, 0) / formatData.length).toFixed(1)
    );
  }, [formatData]);

  const maxAmount = useMemo(() => {
    return formatData.reduce((acc: any, record: any) => Math.max(acc, record.pay_amount), 0);
  }, [formatData]);

  // スケルトンローディング
  if (isLoading) {
    return (
      <Card className="p-5">
        <Skeleton height={30} width="50%" className="mb-3" />
        <Skeleton height={50} count={3} />
      </Card>
    );
  }

  return (
    <Tabs defaultValue="total">
      <TabsList className="grid w-full grid-cols-2 mx-auto">
        <TabsTrigger value="total">総額</TabsTrigger>
        <TabsTrigger value="diff">差額</TabsTrigger>
      </TabsList>
      <Card className="select-none">
        <TabsContent value="diff">
          <div className="flex justify-end items-center m-2 space-x-2">
            <div>基準値:</div>
            <Select defaultValue="average" onValueChange={selectHandler}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="average">平均</SelectItem>
                  <SelectItem value="max">最大</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center p-3">
            {formatData.map((item: any, index: any) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between border-b-2 border-slate-400 mb-3"
              >
                <div>{item.payer_name}</div>
                <div>{(standard === "average" ? averageAmount - item.pay_amount : maxAmount - item.pay_amount).toLocaleString()}円</div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="total">
          <div className="text-center p-3 mt-3">
            {formatData.map((item: any, index: any) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between border-b-2 border-slate-400 mb-3"
              >
                <div>{item.payer_name}</div>
                <div>{item.pay_amount.toLocaleString()}円</div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Card>
    </Tabs>
  );
};
