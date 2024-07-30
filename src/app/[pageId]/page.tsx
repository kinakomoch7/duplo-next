import { LoanPage } from "@/components/loanPage/LoanPage";


export default function Page({params}: {params: {pageId: string}}) {
  
  const pageId = params.pageId;
  
  return (
    <>
      <LoanPage pageId={pageId}/>
    </>
  );
}
