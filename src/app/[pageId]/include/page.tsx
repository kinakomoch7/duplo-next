import { BackButton } from "@/components/common/BackButton";
import { IncludeHistoryBatchPage } from "@/components/formPage/IncludeHistoryBatchPage";

export default function Page() {
  return (
    <div>
      <div className="flex justify-start items-center p-5 pl-3">
        <BackButton />
        <div className="text-md ml-5">まとめて計上</div>
      </div>
      <IncludeHistoryBatchPage />
    </div>
  );
}
