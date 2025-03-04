'use client'

import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


export const HomePage = () => {

  const router = useRouter();

  const formSchema = z.object({
    pageName: z.string(),
    description: z.string(),
    hostname: z.string(),
    username: z.string(),
  });

  const defaultValues = {
    pageName: "a",
    description: "b",
    hostname: "c",
    username: "d",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleClick = async (value: z.infer<typeof formSchema>) => {


    const res = await fetch("/api/createPage", {
      method: "POST",
      body: JSON.stringify({ username: "John", password: "a"}),
      headers: {
        "Content-Type": "application/json",
      },
    });
      const result = await res.json();
      console.log(result);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClick)}>
        {Object.keys(defaultValues).map((key) => (
        <FormField
        key={key}
        control={form.control}
        name={key as any} 
        render={({ field }) =>
          <FormItem>
            <FormLabel>Page Name</FormLabel>
            <FormControl>
              <Input placeholder='aa' {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        }
      />
        ))}
        <Button type="submit" onClick={() => router.push(`/lpdelpdlpelpkopelpd`) }>貸し借り管理を作成する</Button>
      </form>
    </Form>
  );
}
