'use client'

import { useRouter } from 'next/navigation';

type Props = {
  pageId: string;
}

export const LoanPage = (props: Props) => {

  const { pageId } = props;

  const router = useRouter();

  return (
    <div>
      <div className='fixed z-50 bottom-8 right-8 py-5 px-5 bg-gray-300 rounded-full cursor-pointer' onClick={() => router.push(`${pageId}/form`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </div>
  )
}
