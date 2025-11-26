"use client";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { Button as AntButton, Divider, Input as AntInput, Space } from "antd";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface DeviceInfoProps {
  label: string;
  icon: string;
  active: boolean;
  value?: string;
}

export default function DeviceInfo() {
  const [selectedValue, setSelectedValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedValue(value);
  };
  const [items, setItems] = useState<DeviceInfoProps[]>([
    {
      label: "jack",
      value: "jack",
      icon: "/device/Ghost.svg",
      active: false,
    },
    {
      label: "Rose",
      value: "Rose",
      icon: "/device/Ghost.svg",
      active: false,
    },
  ]);
  const [name, setName] = useState(""); // 正确的状态管理
  const [searchValue, setSearchValue] = useState(""); // 追踪 Select 搜索框的输入

  const onSearch = (value: string) => {
    console.log("search:", value);
    setSearchValue(value); // 更新搜索值
  };

  const inputRef = useRef<InputRef>(null);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const addItem = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newName = searchValue.trim(); // 使用 Select 搜索框的值
    if (newName) {
      setItems((prev) => [
        ...prev,
        {
          label: newName,
          value: newName,
          icon: "/device/Ghost.svg",
          active: false,
        },
      ]);
      setSearchValue(""); // 清空搜索框
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addItem();
    }
    // 其他按键不阻止冒泡，让Select组件正常处理
  };

  // 当鼠标移入某个选项时，将该项 active 设为 true，其他设为 false
  const handleOptionMouseEnter = (label: string) => {
    setItems((prev) =>
      prev.map((it) => ({ ...it, active: it.label === label }))
    );
  };

  // 鼠标离开选项时，将该项 active 设为 false
  const handleOptionMouseLeave = (label: string) => {
    setItems((prev) =>
      prev.map((it) => (it.label === label ? { ...it, active: false } : it))
    );
  };

  // 打开编辑对话框
  const handleEditClick = (item: DeviceInfoProps) => {
    setEditValue(item.value || item.label);
    setDialogOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editValue.trim() && selectedValue) {
      setItems((prev) =>
        prev.map((it) =>
          it.value === selectedValue
            ? { ...it, label: editValue.trim(), value: editValue.trim() }
            : it
        )
      );
      setSelectedValue(editValue.trim());
      setDialogOpen(false);
    }
  };

  // 清空输入框
  const handleClearInput = () => {
    setEditValue("");
    // 清空后重新聚焦
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  // 打开删除确认弹窗
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (selectedValue) {
      setItems((prev) => prev.filter((it) => it.value !== selectedValue));
      setSelectedValue(""); // 清空选中值，这样 Select 会清空
      setEditValue("");
    }
    setDeleteDialogOpen(false);
    setDialogOpen(false);
  };

  return (
    <div className="w-full px-6">
      <Label className="text-[#1f1f1f] mb-2">Cluster</Label>
      <Select
        showSearch
        className="w-full"
        placeholder="Select a person"
        optionFilterProp="children"
        value={selectedValue || undefined} // 绑定 value，删除后会自动清空
        onChange={onChange}
        onSearch={onSearch}
        getPopupContainer={(triggerNode) =>
          triggerNode.parentElement || document.body
        }
        filterOption={(input, option) =>
          String(option?.value ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        // 自定义下拉选项的渲染（仅影响下拉，不影响选择框）
        optionRender={(option) => {
          const item = items.find((it) => it.value === option.value);
          if (!item) return option.label;

          return (
            <div
              className="flex items-center justify-between w-full px-1"
              onMouseEnter={() => handleOptionMouseEnter(item.label)}
              onMouseLeave={() => handleOptionMouseLeave(item.label)}
            >
              <span className="truncate">{item.label}</span>
              {item.active ? (
                <img
                  src={item.icon}
                  alt="icon"
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(item);
                  }}
                />
              ) : null}
            </div>
          );
        }}
        popupRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <div
              style={{ padding: "0 8px 4px" }}
              onMouseDown={(e) => e.preventDefault()} // 关键：阻止默认行为
            >
              <Space>
                {/* <AntInput
                  placeholder="Please enter item"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={handleKeyDown}
                  style={{ width: 160 }}
                /> */}
                <AntButton
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addItem}
                  onMouseDown={(e) => e.preventDefault()} // 关键：阻止默认行为
                  disabled={!searchValue.trim()} // Select 搜索框为空时禁用
                >
                  Add New cluster
                </AntButton>
              </Space>
            </div>
          </>
        )}
        options={items.map((item) => ({
          label: item.label, // 选择框显示的纯文本
          value: item.value,
        }))}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[352px] p-3" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-noraml text-[#1f1f1f]">
              Edit Cluster Name
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex justify-between items-center gap-2">
              <div className="relative flex-1">
                <Input
                  ref={editInputRef}
                  id="cluster-name"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onFocus={(e) => {
                    setInputFocused(true);
                    // 防止自动全选，光标移到末尾
                    setTimeout(() => {
                      e.target.selectionStart = e.target.value.length;
                      e.target.selectionEnd = e.target.value.length;
                    }, 0);
                  }}
                  onBlur={() => setInputFocused(false)}
                  className="h-6 border-[#ff6640] w-full pr-8"
                  autoFocus={false}
                />
                {inputFocused && editValue && (
                  <Image
                    src="/device/delete.svg"
                    alt="clear"
                    width={16}
                    height={16}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={handleClearInput}
                  />
                )}
              </div>
              <Image
                src="/device/close.svg"
                alt="delete"
                width={24}
                height={24}
                className="cursor-pointer flex-shrink-0"
                onClick={handleOpenDeleteDialog}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-none hover:bg-none border-none hover:bg-transparent shadow-none cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#ff6640] hover:bg-[#ff6640] cursor-pointer"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[352px] p-3" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>
            <div className="flex items-start gap-3">
              <Image
                src="/device/Attention.svg"
                alt="attention"
                width={24}
                height={24}
                className="mt-1 flex-shrink-0"
              />
              <DialogDescription className="text-[#1f1f1f] text-sm font-normal text-left">
                Are you sure to delete this cluster? All devices using this
                cluster will be unmarked.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-transparent hover:bg-transparent border-none shadow-none cursor-pointer text-[#1f1f1f]"
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-transparent hover:bg-transparent border border-[#ff6640] text-[#ff6640] cursor-pointer"
              variant="outline"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
