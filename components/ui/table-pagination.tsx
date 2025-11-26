"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TablePaginationProps {
  // 当前分页状态
  currentPage: number;           // 当前页码（从0开始）
  pageSize: number;             // 每页条数
  totalItems: number;           // 总数据量
  totalPages: number;           // 总页数
  
  // 分页操作回调
  onPageChange: (page: number) => void;      // 页码改变
  onPageSizeChange: (size: number) => void;  // 每页条数改变
  onPreviousPage: () => void;               // 上一页
  onNextPage: () => void;                   // 下一页
  
  // 分页配置
  pageSizeOptions?: number[];    // 每页条数选项，默认 [10, 20, 30, 40, 50]
  showQuickJumper?: boolean;     // 是否显示快速跳转，默认 true
  showSizeChanger?: boolean;     // 是否显示页面大小选择器，默认 true
  showTotal?: boolean;          // 是否显示总数信息，默认 true
  
  // 导航能力
  canPreviousPage: boolean;     // 是否可以上一页
  canNextPage: boolean;         // 是否可以下一页
  
  // 样式定制
  className?: string;           // 自定义样式类
}

export default function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showQuickJumper = true,
  showSizeChanger = true,
  showTotal = true,
  canPreviousPage,
  canNextPage,
  className = "",
}: TablePaginationProps) {
  
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between my-[15px] sm:space-y-0 sm:space-x-2 bg-white rounded-b-md px-6 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full">
        <div className="flex gap-1">
          {/* 总数信息显示 */}
          {showTotal && (
            <div className="hidden sm:flex items-center">
              <span className="text-sm text-[#8e8e8e] whitespace-nowrap">
                {startItem}-{endItem} of {totalItems} items
              </span>
            </div>
          )}
          
          {/* 每页条数选择器 */}
          {showSizeChanger && (
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center cursor-pointer">
                <select
                  id="page-size-select"
                  value={pageSize}
                  onChange={(e) => {
                    onPageSizeChange(Number(e.target.value));
                  }}
                  className="h-8 rounded border-none text-[#8e8e8e] px-2 text-sm outline-none appearance-none bg-transparent pr-16 py-0 cursor-pointer"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size} className="px-0">
                      {size}
                    </option>
                  ))}
                </select>
                <span className="absolute right-0 pointer-events-none flex items-center text-[#8e8e8e] text-sm">
                  <span>/pages</span>
                  <ChevronDown className="w-[14px] h-[14px] ml-1.5" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          <div className="flex items-center ml-auto">
            {/* 上一页按钮 */}
            <Image
              src="/device/left_pg.svg"
              alt="left"
              width={28}
              height={28}
              onClick={() => {
                if (canPreviousPage) {
                  onPreviousPage();
                }
              }}
              className="mr-4 cursor-pointer"
              style={{
                opacity: canPreviousPage ? 1 : 0.5,
                cursor: canPreviousPage ? 'pointer' : 'not-allowed'
              }}
            />

            {/* 页码显示 - 响应式 */}
            <div className="hidden sm:flex items-center space-x-1">
              {(() => {
                const pages = [];

                if (totalPages <= 7) {
                  // 总页数 <= 7，显示所有页码
                  for (let i = 0; i < totalPages; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className={`h-8 px-3 text-[#1f1f1f] bg-transparent hover:bg-transparent shadow-none ${
                          i === currentPage
                            ? "border border-[#e1e1e1] rounded-[8px] bg-white"
                            : "border-none"
                        }`}
                      >
                        {i + 1}
                      </Button>
                    );
                  }
                } else {
                  // 总页数 > 7，使用省略号
                  // 始终显示第一页
                  pages.push(
                    <Button
                      key={0}
                      variant="ghost"
                      size="sm"
                      onClick={() => onPageChange(0)}
                      className={`h-8 px-3 text-[#1f1f1f] bg-transparent hover:bg-transparent shadow-none ${
                        0 === currentPage
                          ? "border border-[#e1e1e1] rounded-[8px] bg-white"
                          : "border-none"
                      }`}
                    >
                      1
                    </Button>
                  );

                  if (currentPage > 3) {
                    // 显示左侧省略号
                    pages.push(
                      <span key="left-ellipsis" className="px-2 text-[#8e8e8e]">
                        ...
                      </span>
                    );
                  }

                  // 显示当前页附近的页码
                  const start = Math.max(1, currentPage - 1);
                  const end = Math.min(totalPages - 2, currentPage + 1);

                  for (let i = start; i <= end; i++) {
                    if (i > 0 && i < totalPages - 1) {
                      pages.push(
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          onClick={() => onPageChange(i)}
                          className={`h-8 px-3 text-[#1f1f1f] bg-transparent hover:bg-transparent shadow-none ${
                            i === currentPage
                              ? "border border-[#e1e1e1] rounded-[8px] bg-white"
                              : "border-none"
                          }`}
                        >
                          {i + 1}
                        </Button>
                      );
                    }
                  }

                  if (currentPage < totalPages - 4) {
                    // 显示右侧省略号
                    pages.push(
                      <span key="right-ellipsis" className="px-2 text-[#8e8e8e]">
                        ...
                      </span>
                    );
                  }

                  // 始终显示最后一页
                  if (totalPages > 1) {
                    pages.push(
                      <Button
                        key={totalPages - 1}
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(totalPages - 1)}
                        className={`h-8 px-3 text-[#1f1f1f] bg-transparent hover:bg-transparent shadow-none ${
                          totalPages - 1 === currentPage
                            ? "border border-[#e1e1e1] rounded-[8px] bg-white"
                            : "border-none"
                        }`}
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                }

                return pages;
              })()}
            </div>

            {/* 下一页按钮 */}
            <Image
              src="/device/right_pg.svg"
              alt="right"
              width={54}
              height={54}
              onClick={() => {
                if (canNextPage) {
                  onNextPage();
                }
              }}
              className="cursor-pointer"
              style={{
                opacity: canNextPage ? 1 : 0.5,
                cursor: canNextPage ? 'pointer' : 'not-allowed'
              }}
            />
          </div>

          {/* 快速跳转 */}
          {showQuickJumper && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Go to
              </span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  onPageChange(page);
                }}
                className="h-8 w-16 text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}