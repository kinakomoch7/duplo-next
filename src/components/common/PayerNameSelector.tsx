"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "./Fetcher";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { HistoryRecord } from "@/lib/history";

const CUSTOM_VALUE = "__custom__";

type Props = {
  pageId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const PayerNameSelector = ({
  pageId,
  value,
  onChange,
  placeholder = "名前を入力",
}: Props) => {
  const { data } = useSWR(`/api/getHistory/${pageId}`, fetcher);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const payerNames = useMemo(() => {
    const histories = (data as HistoryRecord[] | undefined) ?? [];

    return histories.reduce<string[]>((names, history) => {
      if (!names.includes(history.payer_name)) {
        names.push(history.payer_name);
      }

      return names;
    }, []);
  }, [data]);

  useEffect(() => {
    if (!isCustomMode && !value && payerNames.length > 0) {
      onChange(payerNames[0]);
    }
  }, [value, payerNames, onChange, isCustomMode]);

  useEffect(() => {
    if (value && payerNames.includes(value)) {
      setIsCustomMode(false);
      return;
    }

    if (value && !payerNames.includes(value)) {
      setIsCustomMode(true);
    }
  }, [value, payerNames]);

  if (payerNames.length === 0) {
    return (
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    );
  }

  const selectValue = isCustomMode ? CUSTOM_VALUE : value || payerNames[0];

  return (
    <div className="space-y-3">
      <Select
        value={selectValue}
        onValueChange={(nextValue) => {
          if (nextValue === CUSTOM_VALUE) {
            setIsCustomMode(true);
            onChange("");
            return;
          }

          setIsCustomMode(false);
          onChange(nextValue);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="支払い者を選択" />
        </SelectTrigger>
        <SelectContent>
          {payerNames.map((payerName) => (
            <SelectItem key={payerName} value={payerName}>
              {payerName}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_VALUE}>新しい名前を入力</SelectItem>
        </SelectContent>
      </Select>

      {isCustomMode ? (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      ) : null}
    </div>
  );
};
