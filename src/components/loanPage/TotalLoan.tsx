'use client'
import { useState } from "react"
import { Card } from "../ui/card"
import { fetcher } from "../common/Fetcher"
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { set } from "date-fns";

type Props = {
  pageId: string;
}

export const TotalLoan = (props:Props) => {

  const { pageId } = props;

  const [standard, setStandard] = useState<string>("average");

  const {data, error, isLoading} = useSWR(`/api/getHistory/${pageId}`, fetcher)

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

  const maxAmount = formatData.reduce((acc:any, record:any) => {
    if (acc < record.pay_amount) {
      acc = record.pay_amount
    }
    return acc
  }, 0)


  const selectHandler = (value: string) => {
    setStandard(value)
  }


  return (
    <Tabs defaultValue="diff">
      <TabsList className="grid w-full grid-cols-2 mx-auto">
        <TabsTrigger value="diff">差額</TabsTrigger>
        <TabsTrigger value="total">総額</TabsTrigger>
      </TabsList>
      <Card className="select-none">

        <TabsContent value="diff">
          <div className="flex justify-end items-center m-2 space-x-2">
            <div>基準値:</div>
            <Select defaultValue="average" onValueChange={selectHandler}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue  />
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
            {formatData.map((item:any, index:any) => (
              <div key={index} className="flex justify-between border-b-2 border-slate-400 mb-3">
                <div>{item.payer_name}</div>
                <div>{(standard=="average" ? averageAmount-item.pay_amount : maxAmount-item.pay_amount).toLocaleString()}円</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="total">
          <div className="text-center p-3 mt-3">
            {formatData.map((item:any, index:any) => (
              <div key={index} className="flex justify-between border-b-2 border-slate-400 mb-3">
                <div>{item.payer_name}</div>
                <div>{item.pay_amount.toLocaleString()}円</div>
              </div>
            ))}
          </div>
        </TabsContent>

      </Card>
    </Tabs>
  )
}