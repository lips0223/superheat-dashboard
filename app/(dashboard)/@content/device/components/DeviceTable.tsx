"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FilterImage from "@/components/image/FilterImage";
import SortImage from "@/components/image/SortImage";
import ColumnFilter from "@/components/ui/ColumnFilter";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Settings,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDevices, Device } from "@/lib/mock";
import DeviceControlDrawer from "./DeviceControlDrawer";
import TablePagination from "@/components/ui/table-pagination";

// 扩展列定义类型以支持sticky属性
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    sticky?: "left" | "right";
  }
}

// 状态徽章组件
const StatusBadge = ({ status }: { status: Device["status"] }) => {
  const variants = {
    Online: "bg-[#e5f5ec] text-[#47b881] rounded-[100px] py-[3px] px-2",
    Offline: "bg-[#e4f2ff] text-[#3b82f6] rounded-[100px] py-[3px] px-2",
    Critical: "bg-[#FFEBEE] text-[#F64C4C] rounded-[100px] py-[3px] px-2",
    Attention: "bg-[#FFF7E1] text-[#FFAD0D] rounded-[100px] py-[3px] px-2",
    Inactive: "bg-[#eee] text-[#8e8e8e] rounded-[100px] py-[3px] px-2",
  };

  return (
    <Badge variant="secondary" className={`${variants[status]} border-0`}>
      {status}
    </Badge>
  );
};
//mode 映射
const MODE_CONFIGS: Record<Device["mode"], { icon: string; label: string }> = {
  Normal: { icon: "/device/normal.svg", label: "Normal" },
  Eco: { icon: "/device/eco.svg", label: "Eco" },
  Smart: { icon: "/device/smart.svg", label: "Smart" },
};
// 模式徽章组件
const ModeBadge = ({ mode }: { mode: Device["mode"] }) => {
  const [showMode, setShowMode] = useState(false);
  return (
    <div
      className="flex gap-2 items-center cursor-pointer relative"
      onClick={() => setShowMode(!showMode)}
    >
      <Image
        src={MODE_CONFIGS[mode].icon}
        alt="mode"
        width={14}
        height={14}
      ></Image>
      <div className="text-sm font-normal text-[#4b4b4b]">{mode}</div>
      <Image
        src="/device/keyboard_down.svg"
        alt="keydown"
        width={14}
        height={14}
      ></Image>
      {showMode && (
        <div className="absolute w-[160px] rounded-md bg-white top-5 left-0 shadow-md z-10 py-2">
          {Object.entries(MODE_CONFIGS).map(([key, config]) => (
            <div
              key={key}
              className={`flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                mode === key ? "" : ""
              }`}
              onClick={() => {
                // 这里可以添加切换模式的逻辑
                setShowMode(false);
              }}
            >
              <Image
                src={config.icon}
                alt={config.label}
                width={16}
                height={16}
              />
              <span>{config.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DeviceTable() {
  const { t } = useTranslation("");
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 筛选按钮点击状态管理 - 使用Map结构区分每个header
  const [filterClickStates, setFilterClickStates] = React.useState<
    Map<string, boolean>
  >(new Map());

  // 筛选数据状态管理
  const [selectedFilterValues, setSelectedFilterValues] = React.useState<
    Map<string, string[]>
  >(new Map());

  // 排序图标状态管理 - 使用Map结构区分每个header的排序状态
  const [sortImageStates, setSortImageStates] = React.useState<
    Map<string, "asc" | "desc" | null>
  >(new Map());

  // 当前活跃的筛选框
  const [activeFilterColumn, setActiveFilterColumn] = React.useState<
    string | null
  >(null);

  // 全局点击处理器 - 在DeviceTable级别管理筛选框关闭
  React.useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as Element;

      // 如果没有活跃的筛选框，不处理
      if (!activeFilterColumn) return;

      // 检查是否点击了筛选框内部或筛选按钮
      const clickedFilterContainer = target.closest("[data-filter-container]");
      const clickedFilterButton = target.closest("button[data-filter-button]");

      // 如果点击的是筛选框内部或筛选按钮，不关闭
      if (clickedFilterContainer || clickedFilterButton) {
        return;
      }

      // 其他情况关闭筛选框
      setActiveFilterColumn(null);
      setFilterClickStates(new Map());
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, [activeFilterColumn]);

  // 抽屉状态管理
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(
    null
  );

  // 获取列的唯一值
  const getUniqueColumnValues = (columnId: string): string[] => {
    const values = mockDevices.map((device) => {
      switch (columnId) {
        case "clusterName":
          return device.clusterName;
        case "location":
          return device.location;
        case "mode":
          return device.mode;
        case "status":
          return device.status;
        default:
          return "";
      }
    });
    return [...new Set(values)].filter(Boolean);
  };

  // 处理筛选按钮点击
  const handleFilterClick = (columnId: string, buttonElement?: HTMLElement) => {
    if (activeFilterColumn === columnId) {
      // 如果点击的是当前活跃的列，则关闭
      setActiveFilterColumn(null);
      setFilterClickStates((prev) => {
        const newMap = new Map(prev);
        newMap.set(columnId, false);
        return newMap;
      });
    } else {
      // 打开新的筛选框
      setActiveFilterColumn(columnId);
      setFilterClickStates((prev) => {
        const newMap = new Map();
        newMap.set(columnId, true);
        return newMap;
      });
    }
  };

  // 处理筛选框关闭 - 使用useCallback稳定函数引用
  const handleFilterClose = React.useCallback((columnId: string) => {
    setActiveFilterColumn(null);
    setFilterClickStates((prev) => {
      const newMap = new Map(prev);
      newMap.set(columnId, false);
      return newMap;
    });
  }, []);

  // 处理筛选值改变
  const handleFilterSelectionChange = (
    columnId: string,
    selectedValues: string[]
  ) => {
    setSelectedFilterValues((prev) => {
      const newMap = new Map(prev);
      newMap.set(columnId, selectedValues);
      return newMap;
    });

    // 更新 TanStack Table 的筛选
    setColumnFilters((prev) => {
      const otherFilters = prev.filter((filter) => filter.id !== columnId);
      if (selectedValues.length > 0) {
        return [...otherFilters, { id: columnId, value: selectedValues }];
      }
      return otherFilters;
    });

    // 不再自动关闭筛选框，让用户手动点击外部关闭
  };

  // 处理排序状态改变
  const handleSortChange = (columnId: string, direction: "asc" | "desc") => {
    // 检查当前列是否已经是这个排序方向，如果是则不处理
    const currentDirection = sortImageStates.get(columnId);
    if (currentDirection === direction) {
      return; // 已经激活的状态，不做任何处理
    }

    // 更新排序图标状态 - 清除其他列的排序状态，只保留当前列
    setSortImageStates((prev) => {
      const newMap = new Map();
      newMap.set(columnId, direction);
      return newMap;
    });

    // 更新 TanStack Table 的排序状态
    setSorting([{ id: columnId, desc: direction === "desc" }]);
  };

  // 同步 TanStack Table 的排序状态到 sortImageStates
  React.useEffect(() => {
    setSortImageStates((prev) => {
      const newMap = new Map();
      sorting.forEach((sort) => {
        newMap.set(sort.id, sort.desc ? "desc" : "asc");
      });
      return newMap;
    });
  }, [sorting]);
  // 列定义移到组件内部以使用 router
  const columns: ColumnDef<Device>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 60,
      meta: {
        sticky: "left",
      },
    },
    {
      accessorKey: "deviceId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
        >
          Device ID
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-orange-600">
          {row.getValue("deviceId")}
        </div>
      ),
      size: 140,
      meta: {
        sticky: "left",
      },
    },
    {
      accessorKey: "clusterName",
      header: ({ column }) => {
        const filterButtonRef = React.useRef<HTMLButtonElement>(null);

        return (
          <div className="relative">
            <Button
              ref={filterButtonRef}
              variant="ghost"
              data-filter-button="clusterName"
              onClick={() =>
                handleFilterClick(
                  "clusterName",
                  filterButtonRef.current || undefined
                )
              }
              className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex items-center gap-1"
            >
              Cluster Name
              <FilterImage
                isClicked={filterClickStates.get("clusterName") || false}
              />
            </Button>

            {/* clusterName 的筛选框 */}
            {activeFilterColumn === "clusterName" && (
              <ColumnFilter
                isOpen={true}
                onClose={() => handleFilterClose("clusterName")}
                columnId="clusterName"
                columnData={getUniqueColumnValues("clusterName")}
                selectedValues={selectedFilterValues.get("clusterName") || []}
                onSelectionChange={(values) =>
                  handleFilterSelectionChange("clusterName", values)
                }
                title="集群名称"
                position={{ top: 30, left: 0 }}
              />
            )}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("clusterName")}</div>
      ),
      size: 180,
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
        >
          Customer Name
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customerName")}</div>
      ),
      size: 180,
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        const filterButtonRef = React.useRef<HTMLButtonElement>(null);

        return (
          <div className="relative">
            <Button
              ref={filterButtonRef}
              variant="ghost"
              data-filter-button="location"
              onClick={() =>
                handleFilterClick(
                  "location",
                  filterButtonRef.current || undefined
                )
              }
              className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex items-center gap-1"
            >
              Location
              <FilterImage
                isClicked={filterClickStates.get("location") || false}
              />
            </Button>

            {/* location 的筛选框 */}
            {activeFilterColumn === "location" && (
              <ColumnFilter
                isOpen={true}
                onClose={() => handleFilterClose("location")}
                columnId="location"
                columnData={getUniqueColumnValues("location")}
                selectedValues={selectedFilterValues.get("location") || []}
                onSelectionChange={(values) =>
                  handleFilterSelectionChange("location", values)
                }
                title="位置"
                position={{ top: 30, left: -80 }}
              />
            )}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-gray-600">{row.getValue("location")}</div>
      ),
      size: 180,
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "mode",
      header: ({ column }) => {
        const filterButtonRef = React.useRef<HTMLButtonElement>(null);

        return (
          <div className="relative">
            <Button
              ref={filterButtonRef}
              variant="ghost"
              data-filter-button="mode"
              onClick={() =>
                handleFilterClick("mode", filterButtonRef.current || undefined)
              }
              className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex items-center gap-1"
            >
              Mode
              <FilterImage isClicked={filterClickStates.get("mode") || false} />
            </Button>

            {/* mode 的筛选框 */}
            {activeFilterColumn === "mode" && (
              <ColumnFilter
                isOpen={true}
                onClose={() => handleFilterClose("mode")}
                columnId="mode"
                columnData={getUniqueColumnValues("mode")}
                selectedValues={selectedFilterValues.get("mode") || []}
                onSelectionChange={(values) =>
                  handleFilterSelectionChange("mode", values)
                }
                title="模式"
                position={{ top: 30, left: -30 }}
              />
            )}
          </div>
        );
      },
      cell: ({ row }) => <ModeBadge mode={row.getValue("mode")} />,
      size: 120,
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "targetTemp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-1"
        >
          Target Temp
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("targetTemp")}°C</div>
      ),
      size: 120,
    },
    {
      accessorKey: "currentTemp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-0"
        >
          Current Temp
          <SortImage
            sortDirection={sortImageStates.get("currentTemp") || null}
            onSortChange={(direction) =>
              handleSortChange("currentTemp", direction)
            }
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("currentTemp")}°C</div>
      ),
      size: 130,
    },
    {
      accessorKey: "hashrate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-0"
        >
          Hash...
          <SortImage
            sortDirection={sortImageStates.get("hashrate") || null}
            onSortChange={(direction) =>
              handleSortChange("hashrate", direction)
            }
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("hashrate")}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "powerDraw",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-0"
        >
          Power Draw
          <SortImage
            sortDirection={sortImageStates.get("powerDraw") || null}
            onSortChange={(direction) =>
              handleSortChange("powerDraw", direction)
            }
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("powerDraw")}W</div>
      ),
      size: 120,
    },
    {
      accessorKey: "efficiency",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-0"
        >
          Efficiency
          <SortImage
            sortDirection={sortImageStates.get("efficiency") || null}
            onSortChange={(direction) =>
              handleSortChange("efficiency", direction)
            }
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue("efficiency")} J/GH
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "uptime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex gap-0"
        >
          Uptime
          <SortImage
            sortDirection={sortImageStates.get("uptime") || null}
            onSortChange={(direction) => handleSortChange("uptime", direction)}
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("uptime")}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        const filterButtonRef = React.useRef<HTMLButtonElement>(null);

        return (
          <div className="relative">
            <Button
              ref={filterButtonRef}
              variant="ghost"
              data-filter-button="status"
              onClick={() =>
                handleFilterClick(
                  "status",
                  filterButtonRef.current || undefined
                )
              }
              className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent flex items-center gap-1"
            >
              Status
              <FilterImage
                isClicked={filterClickStates.get("status") || false}
              />
            </Button>

            {/* status 的筛选框 */}
            {activeFilterColumn === "status" && (
              <ColumnFilter
                isOpen={true}
                onClose={() => handleFilterClose("status")}
                columnId="status"
                columnData={getUniqueColumnValues("status")}
                selectedValues={selectedFilterValues.get("status") || []}
                onSelectionChange={(values) =>
                  handleFilterSelectionChange("status", values)
                }
                title="状态"
                position={{ top: 30, left: -10 }}
              />
            )}
          </div>
        );
      },
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      size: 120,
      meta: {
        sticky: "right",
      },
      filterFn: "arrIncludes",
    },
    {
      id: "actions",
      enableHiding: false,
      header: ({ column }) => <div>Actions</div>,
      cell: ({ row }) => {
        const device = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-4 w-8 p-0 flex items-center justify-center cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] border-none">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/device/${device.id}`);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedDevice(device);
                  setDrawerOpen(true);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit & Control
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Device Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 80,
      meta: {
        sticky: "right",
      },
    },
  ];

  const table = useReactTable({
    data: mockDevices,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      arrIncludes: (row, id, value) => {
        if (!value || value.length === 0) return true;
        const cellValue = row.getValue(id) as string;
        return value.includes(cellValue);
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4">
        <p>{t("common.device.list")}</p>
        <div className="flex items-center gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {/* 批量操作按钮 - 只有选中2个或以上项目时才显示 */}
            {Object.keys(rowSelection).length >= 2 && (
              <div className="flex items-center gap-1 px-2 py-[7px] rounded-[8px] cursor-pointer border border-[#e1e1e1]">
                <Image
                  src="/device/checklist.svg"
                  alt="checklist"
                  width={16}
                  height={16}
                ></Image>
                <span className="text-sm">Batch Operations</span>
              </div>
            )}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter device ID/name"
                value={
                  (table.getColumn("deviceId")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("deviceId")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-8 w-full sm:w-[250px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "deviceId"
                          ? "Device ID"
                          : column.id === "customerName"
                          ? "Customer Name"
                          : column.id === "targetTemp"
                          ? "Target Temp"
                          : column.id === "currentTemp"
                          ? "Current Temp"
                          : column.id === "hashrate"
                          ? "Hashrate"
                          : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto cursor-pointer text-white px-2 py-2 rounded-[8px] flex items-center justify-center gap-1 text-sm font-medium">
            <Plus className=" h-4 w-4" />
            New Device
          </Button>
        </div>
      </div>

      {/* 表格容器 - 核心宽度控制 */}
      <div className="w-full border">
        {/* 大屏幕：三列固定布局 */}
        <div className="hidden lg:block w-full">
          <div className="flex">
            {/* 左侧固定列 - 严格200px */}
            <div className="w-[200px] border-r bg-gray-50/30 shrink-0 shadow-[2px_0_4px_0_rgba(0,0,0,0.1)]">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b bg-gray-50"
                    >
                      {headerGroup.headers
                        .filter(
                          (header) =>
                            header.column.columnDef.meta?.sticky === "left"
                        )
                        .map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-12 px-4 text-left align-middle font-medium text-gray-500 whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-blue-50 h-12"
                      >
                        {row
                          .getVisibleCells()
                          .filter(
                            (cell) =>
                              cell.column.columnDef.meta?.sticky === "left"
                          )
                          .map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="px-4 py-3 align-middle whitespace-nowrap h-12"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 中间滚动区域 - 关键：使用calc()计算剩余宽度 */}
            <div className="w-[calc(100%-400px)] overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b bg-gray-50"
                    >
                      {headerGroup.headers
                        .filter(
                          (header) => !header.column.columnDef.meta?.sticky
                        )
                        .map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-12 px-4 text-left align-middle font-medium text-gray-500 whitespace-nowrap"
                            style={{
                              width: `${header.getSize()}px`,
                              minWidth: `${header.getSize()}px`,
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length
                    ? table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-blue-50 h-12"
                        >
                          {row
                            .getVisibleCells()
                            .filter(
                              (cell) => !cell.column.columnDef.meta?.sticky
                            )
                            .map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="px-4 py-3 align-middle whitespace-nowrap h-12"
                                style={{
                                  width: `${cell.column.getSize()}px`,
                                  minWidth: `${cell.column.getSize()}px`,
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>

            {/* 右侧固定列 - 包含status和actions */}
            <div className="w-[200px] border-l bg-gray-50/30 shrink-0 shadow-[-2px_0_4px_0_rgba(0,0,0,0.1)]">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b bg-gray-50"
                    >
                      {headerGroup.headers
                        .filter(
                          (header) =>
                            header.column.columnDef.meta?.sticky === "right"
                        )
                        .map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-12 px-4 text-left align-middle font-medium text-gray-500 whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-blue-50 h-12"
                      >
                        {row
                          .getVisibleCells()
                          .filter(
                            (cell) =>
                              cell.column.columnDef.meta?.sticky === "right"
                          )
                          .map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="px-4 py-3 align-middle whitespace-nowrap h-12"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="h-24 text-center">-</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* 小屏幕：普通滚动表格 */}
        <div className="lg:hidden overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 分页控件 */}
      <TablePagination
        currentPage={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        totalItems={table.getFilteredRowModel().rows.length}
        totalPages={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page)}
        onPageSizeChange={(size) => table.setPageSize(size)}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />

      {/* 设备控制抽屉 */}
      <DeviceControlDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        device={selectedDevice}
      />
    </div>
  );
}
