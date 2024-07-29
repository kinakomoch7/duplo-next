'use client'

import { FormEvent } from "react";
import { Button } from "../ui/button";


export const HomePage = () => {

  const handleClick = async (event: FormEvent) => {

    event.preventDefault();

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
    <form onSubmit={handleClick}>
      <Button type="submit">Click me</Button>
    </form>
  );
}
