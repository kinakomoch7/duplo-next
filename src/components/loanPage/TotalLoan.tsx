'use client'
import { useState } from "react"
import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { fetcher } from "../common/Fetcher"
import useSWR from "swr";

const TEST = [
  {
    userName: 'ユーザネーム１',
    amount: '金額１'
  },
  {
    userName: 'ユーザネーム２',
    amount: '金額２'
  },
  {
    userName: 'ユーザネーム３',
    amount: '金額３'
  },
  {
    userName: 'ユーザネーム４',
    amount: '金額４'
  },
  {
    userName: 'ユーザネーム５',
    amount: '金額５'
  }
]


export const TotalLoan = () => {

  const [isFull, setIsFull] = useState<boolean>(false)

  const {data, error, isLoading} = useSWR(`/api/getHistory/57fe2f9c743d4a63a1c53c04ae4bff40`, fetcher)

  if (isLoading) return <div>loading....</div>

  const formatData = data.reduce((acc:any, record:any) => {
    const isRecord = acc.find((item:any) => item.payer_name === record.payer_name);
    if (isRecord) {
      isRecord.pay_amount += record.pay_amount
    } else {
      acc.push({payer_name: record.payer_name, pay_amount: record.pay_amount})
    }
    return acc
  }, [])

  const averageAmount = formatData.reduce((acc:any, record:any) => {
    acc += record.pay_amount
    return acc
  }, 0) / formatData.length


  const switchHandler = (checked: boolean) => {
    setIsFull(checked)
  }


  return (
    <Card className="select-none">
      <div className="flex items-center justify-end space-x-2 m-3">
        <Switch onCheckedChange={switchHandler}/>
        <Label>支払い総額を表示</Label>
      </div>

      <div className="text-center p-3">
        {formatData.map((item:any, index:any) => (
          <div key={index} className="flex justify-between border-b-2 border-slate-400 mb-3">
            <div>{item.payer_name}</div>
            <div>{isFull ? item.pay_amount : averageAmount-item.pay_amount}</div>
          </div>
          ))}
      </div>
    </Card>
  )
}
