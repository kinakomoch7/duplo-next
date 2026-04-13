export type HistoryRecord = {
  history_id: number;
  payer_name: string;
  pay_amount: number;
  pay_time: string;
  note: string;
  is_included: boolean;
  url?: string;
  last_edit?: string;
};
