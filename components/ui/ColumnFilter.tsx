"use client";

import React, { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ColumnFilterProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  columnData: string[]; // 该列的所有唯一值
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  title?: string;
  position?: { top: number; left: number }; // 定位信息
}

export default function ColumnFilter({
  isOpen,
  onClose,
  columnId,
  columnData,
  selectedValues,
  onSelectionChange,
  title,
  position,
}: ColumnFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
  const filterRef = useRef<HTMLDivElement>(null);

  // 筛选数据
  const filteredData = columnData.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 不再使用外部点击监听器，由父组件管理
  // useEffect(() => {
  //   console.log("ColumnFilter useEffect isOpen:", isOpen);
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

  // 重置本地状态
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedValues(selectedValues);
      setSearchTerm("");
    }
  }, [isOpen, selectedValues]);

  const handleSelectAll = () => {
    setLocalSelectedValues(filteredData);
  };

  const handleClearAll = () => {
    setLocalSelectedValues([]);
  };

  const handleItemToggle = (value: string) => {
    // 标记开始处理点击
    
    const newValues = localSelectedValues.includes(value) 
      ? localSelectedValues.filter(v => v !== value)
      : [...localSelectedValues, value];
    
    setLocalSelectedValues(newValues);
    onSelectionChange(newValues);
    
    
  };


  if (!isOpen) return null;

  return (
    <div 
      ref={filterRef}
      data-filter-container="true"
      className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg  max-w-[160px]"
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* 头部 */}
      {/* <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <span className="text-orange-500">🔽</span>
          {title}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div> */}

      {/* 搜索框 */}
      {/* <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div> */}

      {/* 操作按钮 */}
      {/* <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSelectAll}
            className="h-7 text-xs"
          >
            全选
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearAll}
            className="h-7 text-xs"
          >
            清空
          </Button>
        </div>
        <span className="text-xs text-gray-500">
          已选择 {localSelectedValues.length} / {columnData.length}
        </span>
      </div> */}

      {/* 选项列表 */}
      <div className="max-h-60 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            无匹配结果
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div 
              key={`${columnId}-${item}-${index}`}
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer hover:rounded-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleItemToggle(item);
              }}
            >
              <Checkbox
                checked={localSelectedValues.includes(item)}
                onChange={() => handleItemToggle(item)}
                className="pointer-events-none"
              />
              <span className="text-sm text-gray-700 flex-1 truncate" title={item}>
                {item}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 底部操作 */}
        {/* <div className="flex items-center justify-end gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
            <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancel}
            className="h-8"
            >
            取消
            </Button>
            <Button 
            size="sm"
            onClick={handleApply}
            className="h-8 bg-orange-500 hover:bg-orange-600"
            >
            应用筛选
            </Button>
        </div> */}
    </div>
  );
}