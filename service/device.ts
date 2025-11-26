import request from './request';

/**
 * 设备管理相关接口
 */

// ============ 类型定义 ============

/** 设备信息 */
export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  customerId: string;
  customerName: string;
  model: string;
  hashrate: number; // TH/s
  temperature: number; // °C
  power: number; // kW
  earnings: number; // BTC
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastOnlineAt: string;
  installedAt: string;
  updatedAt: string;
}

/** 设备列表查询参数 */
export interface DeviceListParams {
  page?: number;
  pageSize?: number;
  status?: Device['status'];
  customerId?: string;
  keyword?: string; // 搜索关键词
}

/** 设备列表响应 */
export interface DeviceListResponse {
  list: Device[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建设备参数 */
export interface CreateDeviceParams {
  name: string;
  serialNumber: string;
  customerId: string;
  model: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

/** 更新设备参数 */
export interface UpdateDeviceParams {
  id: string;
  name?: string;
  status?: Device['status'];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

// ============ API 方法 ============

/**
 * 获取设备列表
 */
export const getDeviceList = (params?: DeviceListParams) => {
  return request.get<DeviceListResponse>('/devices', params);
};

/**
 * 获取设备详情
 */
export const getDeviceDetail = (id: string) => {
  return request.get<Device>(`/devices/${id}`);
};

/**
 * 创建设备
 */
export const createDevice = (params: CreateDeviceParams) => {
  return request.post<Device>('/devices', params);
};

/**
 * 更新设备
 */
export const updateDevice = (params: UpdateDeviceParams) => {
  const { id, ...data } = params;
  return request.put<Device>(`/devices/${id}`, data);
};

/**
 * 删除设备
 */
export const deleteDevice = (id: string) => {
  return request.delete(`/devices/${id}`);
};

/**
 * 批量删除设备
 */
export const batchDeleteDevices = (ids: string[]) => {
  return request.post('/devices/batch-delete', { ids });
};

/**
 * 重启设备
 */
export const restartDevice = (id: string) => {
  return request.post(`/devices/${id}/restart`);
};

/**
 * 获取设备实时数据
 */
export const getDeviceRealtimeData = (id: string) => {
  return request.get<{
    hashrate: number;
    temperature: number;
    power: number;
    timestamp: string;
  }>(`/devices/${id}/realtime`);
};
