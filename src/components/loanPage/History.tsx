'use client'
import { Card } from "../ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { useSWRConfig } from "swr";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";


type Props = {
  name: string;
  amount: number;
  time: string;
  note: string;
  historyId: number;
  pageId: string;
}

export const History = (props:Props) => {

  const { name, amount, time, note, historyId, pageId } = props;

  const { mutate } = useSWRConfig();

  const date = new Date(time);

  const formSchema = z.object({
    payerName: z.string().min(1, {message: "名前を入力してください"}),
    amount: z.coerce.number().min(1, {message: "金額を入力してください"}),
    payTime: z.date(),
    note: z.string().min(1, {message: "メモを入力してください"}),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payerName: name,
      amount: amount,
      payTime: new Date(time),
      note: note,
    },
  });

  const updateHandler = async (value: z.infer<typeof formSchema>) => {

    console.log(value)
      
      const res = await fetch("/api/updateHistory", {
        method: "POST",
        body: JSON.stringify({historyId, ...value}),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.status === 200) {
        mutate(`/api/getHistory/${pageId}`)
      }
      if (res.status === 500) {
        return alert("エラーが発生しました")
      }
    }

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
          
          <Dialog>
            <DialogTrigger asChild>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>編集</DialogTitle>
                <DialogDescription>履歴の編集</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(updateHandler)} className="space-y-6">
                  <fieldset>
                  <FormField
                    control={form.control}
                    name='payerName'
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>支払い者名</FormLabel>
                        <FormControl>
                          <Input placeholder='山田たろう' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      }
                  />
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>支払い金額</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      }
                    />
                  <FormField
                    control={form.control}
                    name='payTime'
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>支払日</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "w-full flex"
                                )} >
                                {field.value ? field.value.toLocaleDateString() : <span>日付を選択</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-auto">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                      }
                    />
                  <FormField
                    control={form.control}
                    name='note'
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>メモ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          支払内容に関するメモを入力してください
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                      }
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit">保存</Button>
                      </DialogClose>
                    </DialogFooter>
                    
                  </fieldset>
                </form>
              </Form>
            </DialogContent>
          </Dialog>


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

