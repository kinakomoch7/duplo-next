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
  const {data, error, isLoading} = useSWR(`/api/totalLoan/57fe2f9c743d4a63a1c53c04ae4bff40`, fetcher)

  const switchHandler = (checked: boolean) => {
    setIsFull(checked)
  }


  return (
    <Card className="select-none">
      <div className="flex items-center justify-end space-x-2 m-3">
        <Switch onCheckedChange={switchHandler}/>
        <Label>金額をすべて表示</Label>
      </div>

      <div className="text-center p-3">
        {TEST.map((item, index) => (
          <div key={index} className="flex justify-between border-b-2 border-slate-400 mb-3">
            <div>{item.userName}</div>
            <div>{isFull ? item.amount : '---'}</div>
          </div>
          ))}
      </div>
    </Card>
  )
}
