import { Search, Car, MapPin, Video, FileText, Monitor, BarChart3, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import type { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: 'person-search',
    name: '人员查找',
    description: '通过姓名、身份证号、人脸特征等多种方式查找人员信息',
    icon: <Search size={18} />,
    category: 'search',
    params: { name: '', idCard: '', faceImage: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
          success: true,
          data: {
            name: params.name || '张三',
            idCard: params.idCard || '110101199001011234',
            gender: '男',
            age: 34,
            address: '北京市朝阳区xxx街道',
            lastSeen: '2024-01-15 14:30:00',
            photos: [
              { time: '2024-01-15 14:30:00', location: '东门入口', camera: 'CAM-001' },
              { time: '2024-01-15 14:25:00', location: '主干道', camera: 'CAM-005' },
            ],
          },
          message: '找到匹配人员信息',
        });
        }, 1500);
      });
    },
  },
  {
    id: 'vehicle-search',
    name: '车辆查找',
    description: '通过车牌号、车型、颜色等信息查找车辆',
    icon: <Car size={18} />,
    category: 'search',
    params: { plateNumber: '', vehicleType: '', color: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              plateNumber: params.plateNumber || '京A12345',
              vehicleType: params.vehicleType || '轿车',
              color: params.color || '黑色',
              brand: '奔驰',
              model: 'E300L',
              owner: '李四',
              lastSeen: '2024-01-15 15:00:00',
              records: [
                { time: '2024-01-15 15:00:00', location: '南门停车场', camera: 'CAM-012' },
                { time: '2024-01-15 14:45:00', location: '园区道路', camera: 'CAM-008' },
              ],
            },
            message: '找到匹配车辆信息',
          });
        }, 1200);
      });
    },
  },
  {
    id: 'track-trace',
    name: '轨迹追踪',
    description: '查询人员或车辆的移动轨迹',
    icon: <MapPin size={18} />,
    category: 'tracking',
    params: { targetId: '', startTime: '', endTime: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            targetId: params.targetId || 'PERSON-001',
            totalPoints: 12,
            startTime: params.startTime || '2024-01-15 08:00:00',
            endTime: params.endTime || '2024-01-15 18:00:00',
            trajectory: [
              { time: '2024-01-15 08:00:00', location: '东门', lat: 39.9042, lng: 116.4074 },
              { time: '2024-01-15 09:30:00', location: '办公大楼', lat: 39.9050, lng: 116.4080 },
              { time: '2024-01-15 12:00:00', location: '餐厅', lat: 39.9055, lng: 116.4090 },
              { time: '2024-01-15 14:30:00', location: '会议室', lat: 39.9060, lng: 116.4095 },
              { time: '2024-01-15 17:30:00', location: '西门', lat: 39.9035, lng: 116.4060 },
            ],
          },
          message: '轨迹追踪完成',
        });
        }, 1800);
      });
    },
  },
  {
    id: 'video-retrieval',
    name: '录像检索',
    description: '按时间、地点、事件检索监控录像',
    icon: <Video size={18} />,
    category: 'search',
    params: { cameraId: '', startTime: '', endTime: '', eventType: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            cameraId: params.cameraId || 'CAM-001',
            cameraName: '东门入口',
            totalClips: 5,
            clips: [
              { startTime: '2024-01-15 08:00:00', endTime: '2024-01-15 08:15:00', duration: 900, size: '128MB' },
              { startTime: '2024-01-15 09:00:00', endTime: '2024-01-15 09:20:00', duration: 1200, size: '180MB' },
            ],
          },
          message: '检索到相关录像',
        });
        }, 1000);
      });
    },
  },
  {
    id: 'archive-query',
    name: '档案查询',
    description: '查询人员、车辆、案件等档案信息',
    icon: <FileText size={18} />,
    category: 'search',
    params: { archiveType: '', keyword: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            archiveType: params.archiveType || 'person',
            total: 23,
            results: [
              { id: 'A-001', name: '人员档案-张三', type: 'person', updatedAt: '2024-01-10' },
              { id: 'A-002', name: '车辆档案-京A12345', type: 'vehicle', updatedAt: '2024-01-12' },
            ],
          },
          message: '档案查询完成',
        });
        }, 800);
      });
    },
  },
  {
    id: 'device-status',
    name: '设备状态',
    description: '监控设备在线状态、健康度检查',
    icon: <Monitor size={18} />,
    category: 'device',
    params: { deviceType: '' },
    handler: async (_params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            total: 156,
            online: 148,
            offline: 5,
            fault: 3,
            devices: [
              { id: 'CAM-001', name: '东门入口', status: 'online', lastHeartbeat: '2024-01-15 15:30:00' },
              { id: 'CAM-002', name: '南门入口', status: 'online', lastHeartbeat: '2024-01-15 15:30:00' },
              { id: 'CAM-003', name: '西门入口', status: 'offline', lastHeartbeat: '2024-01-15 12:00:00' },
            ],
          },
          message: '设备状态获取成功',
        });
        }, 600);
      });
    },
  },
  {
    id: 'data-analysis',
    name: '数据分析',
    description: '人流、车流统计分析',
    icon: <BarChart3 size={18} />,
    category: 'data',
    params: { analysisType: '', timeRange: '' },
    handler: async (params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            analysisType: params.analysisType || 'people_flow',
            timeRange: params.timeRange || 'today',
            peopleIn: 12345,
            peopleOut: 11890,
            peakTime: '08:30-09:00',
            vehicleIn: 3456,
            vehicleOut: 3321,
            trend: 'stable',
          },
          message: '数据分析完成',
        });
        }, 2000);
      });
    },
  },
  {
    id: 'alarm-analysis',
    name: '报警分析',
    description: '报警事件统计与趋势分析',
    icon: <AlertTriangle size={18} />,
    category: 'analysis',
    params: { timeRange: '', severity: '' },
    handler: async (_params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            total: 45,
            handled: 42,
            pending: 3,
            severity: { critical: 2, warning: 15, info: 28 },
            types: { intrusion: 8, fire: 1, device: 5, other: 31 },
          },
          message: '报警分析完成',
        });
        }, 1500);
      });
    },
  },
  {
    id: 'report-generate',
    name: '报告生成',
    description: '自动生成研判报告',
    icon: <FileSpreadsheet size={18} />,
    category: 'report',
    params: { reportType: '', timeRange: '' },
    handler: async (_params: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
            reportId: 'RPT-' + Date.now(),
            title: '安防工作研判报告',
            generatedAt: new Date().toISOString(),
            sections: [
              { title: '总体概况', content: '今日整体安防态势平稳...' },
              { title: '人流分析', content: '今日人流量较昨日增长5%...' },
              { title: '报警处置', content: '今日共处理报警事件45起...' },
            ],
            recommendations: [
              '加强早高峰时段人流疏导',
              '重点区域增加巡逻频次',
            ],
          },
          message: '报告生成成功',
        });
        }, 2500);
      });
    },
  },
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};
