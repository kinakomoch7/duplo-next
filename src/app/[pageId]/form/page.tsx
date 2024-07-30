import { BackButton } from "@/components/common/BackButton";
import { FormPage } from "@/components/formPage/FormPage";

export default function Page() {
  return (
    <div>
      <div className="flex justify-start items-center p-5 pl-3">
        <BackButton />
        <div className="text-md ml-5">支払い登録</div>
      </div>
      <FormPage />
    </div>
  )
}