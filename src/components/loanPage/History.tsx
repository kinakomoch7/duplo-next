'use client'
import { Card } from "../ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { useSWRConfig } from "swr";


type Props = {
  name: string;
  amount: string;
  time: string;
  note: string;
  historyId: number;
  pageId: string;
}

export const History = (props:Props) => {

  const { name, amount, time, note, historyId, pageId } = props;

  const { mutate } = useSWRConfig();

  const date = new Date(time);

  const deleteHandler = async() => {
    const res = await fetch("/api/deleteHistory", {
      method: "POST",
      body: JSON.stringify({historyId}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      mutate(`/api/getHistory/${pageId}`)
    }
  }


  return (
    <Card className="p-3">
      <div className="flex flex-1 justify-between">
        <div className="font-bold">{name}</div>
        <div>{amount.toLocaleString()}円</div>

        <div className="flex space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer" >
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当に削除してもよろしいですか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={deleteHandler}>はい</AlertDialogAction>
                <AlertDialogCancel>いいえ</AlertDialogCancel>
            </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

      </div>

      <div className="flex flex-1 justify-between">
        <div className="text-sm">{'メモ：' + note}</div>
        <div>{date.toLocaleDateString()}</div>
      </div>
    </Card>
  )
}

