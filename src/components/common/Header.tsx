
export const Header = () => {
  return (
    <div className="bg-white text-slate-900 flex justify-around items-center p-3 border-slate-700 border-b-2 h-[8vh]">
      <div className="font-bold text-xl md:text-2xl">奢り奢られ清算
      </div>
      <div className="text-xs md:text-sm">
        <p >支払いをメモして管理するツール</p>
        <p className="hidden md:inline">忘れずに管理しましょう</p>
      </div>
    </div>
  )
}
