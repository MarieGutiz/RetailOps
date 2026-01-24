import { useState } from "react"
import type { SortingState } from "@tanstack/react-table"

export const useProductTableState = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
  })

  return {
    sorting,
    setSorting,
    search,
    setSearch,
    pagination,
    setPagination,
  }
}
