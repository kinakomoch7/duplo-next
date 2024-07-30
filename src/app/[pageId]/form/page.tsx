import { BackButton } from "@/components/common/BackButton";
import { FormPage } from "@/components/formPage/FormPage";

export default function Page() {
  return (
    <div className="max-w-4xl p-3 m-auto">
      <div className="flex justify-start items-center">
        <BackButton />
        <div className="text-md">支払い登録</div>
      </div>
      <FormPage />
    </div>
  )
}