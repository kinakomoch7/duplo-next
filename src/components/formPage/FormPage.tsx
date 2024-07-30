'use client'

import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

export const FormPage = () => {

  const router = useRouter()

  const formSchema = z.object({
    payerName: z.string().min(1, {message: "名前を入力してください"}),
    amount: z.number().min(1, {message: "金額を入力してください"}),
    payTime: z.date(),
    note: z.string().min(1, {message: "メモを入力してください"}),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payerName: "山田",
      amount: 1000,
      payTime: new Date(),
      note: "メモ",
    },
  });

  const handleClick = async (value: z.infer<typeof formSchema>) => {

    const res = await fetch("/api/postHistory", {
      method: "POST",
      body: JSON.stringify({eventId: 1 , ...value}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      router.back();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClick)} className="space-y-6">
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
        <Button type="submit" className="block mx-auto">支払いを登録</Button>
      </form>
    </Form>
  );
}