type PaginationProps = {
    page: number
    totalPages: number
    nextPage: () => void
    prevPage: () => void
    goToPage: (page: number) => void
  }
  
  export default function Pagination({
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  }: PaginationProps) {
    // 🔹 ฟังก์ชัน generate เลขหน้าที่จะแสดง
    const getPageNumbers = () => {
      const maxVisible = 5
      let start = Math.max(1, page - Math.floor(maxVisible / 2))
      let end = start + maxVisible - 1
  
      if (end > totalPages) {
        end = totalPages
        start = Math.max(1, end - maxVisible + 1)
      }
  
      const pages = []
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    }
  
    const pageNumbers = getPageNumbers()
  
    return (
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        {/* ปุ่มก่อนหน้า */}
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← ก่อนหน้า
        </button>
  
        {/* ปุ่มหน้าแรก ถ้า start > 1 */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-1.5 rounded font-medium border bg-gray-200 border-gray-200 hover:bg-gray-300"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-2">...</span>}
          </>
        )}
  
        {/* ปุ่มเลขหน้า */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3 py-1.5 rounded font-medium border transition ${
              page === num
                ? "bg-blue-100 border-blue-500 text-blue-700"
                : "bg-gray-200 border-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
  
        {/* ปุ่มหน้าสุดท้าย ถ้า end < totalPages */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2">...</span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-1.5 rounded font-medium border bg-gray-200 border-gray-200 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
  
        {/* ปุ่มถัดไป */}
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ถัดไป →
        </button>
      </div>
    )
  }
  