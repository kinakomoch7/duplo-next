import { PopoverContent } from "@radix-ui/react-popover"
import { Card } from "../ui/card"
import { Popover, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"


type Props = {
  name: string;
  amount: string;
  time: string;
  note: string;
}

export const History = (props:Props) => {

  const { name, amount, time, note } = props;

  console.log(typeof time);

  const date = new Date(time);


  return (
    <Card className="p-3">
      <div className="flex flex-1 justify-between">
        <div>{name}</div>
        <div>{amount.toLocaleString()}円</div>
        <Popover>
          <PopoverTrigger asChild>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </PopoverTrigger>
          <PopoverContent>
            <Card className="p-3 flex flex-col">
              <Button>削除</Button>
              <Button>編集</Button>
            </Card>
          </PopoverContent>
        </Popover>

      </div>

      <div className="flex flex-1 justify-around">
        <div>{note}</div>
        <div>{date.toLocaleDateString()}</div>
      </div>
    </Card>
  )
}

