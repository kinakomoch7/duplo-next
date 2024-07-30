'use client'

import { useRouter } from 'next/navigation';
import { CopyUrl } from './CopyUrl';
import { TotalLoan } from './TotalLoan';
import { History } from './History';

type Props = {
  pageId: string;
}

export const LoanPage = (props: Props) => {

  const { pageId } = props;

  const router = useRouter();

  return (
    <div className='space-y-5 md:space-y-7'>
      <TotalLoan />

      <div>
        <div>履歴</div>
        <History />
      </div>

      <div>
        <div className='border-b-2 border-slate-400 mb-3'>この画面のURL</div>
        <CopyUrl />
      </div>

      {/* Floating button */}
      <div className='fixed z-50 bottom-8 right-8 py-5 px-5 bg-gray-300 rounded-full cursor-pointer' onClick={() => router.push(`${pageId}/form`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </div>
  )
}
