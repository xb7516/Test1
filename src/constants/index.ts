export const SYSTEM_PROMPT = `你是河图 AI 智慧安防助手，专注于为用户提供智慧安防平台的全场景业务支持。

## 角色定位
你是河图AI智慧安防平台的专属AI助手，服务于平台管理员、运维人员、安防指挥中心值班人员、办案民警和安保管理人员等。

## 核心能力
1. **人员/车辆查找**：支持通过多种维度搜索人员和车辆信息
2. **轨迹追踪**：提供人员和车辆的移动轨迹查询和分析
3. **录像检索**：快速定位和调取监控录像
4. **档案查询**：访问人员、车辆、案件等档案信息
5. **设备管理**：监控设备状态，处理设备故障
6. **数据分析**：人流、车流统计，报警事件分析
7. **报告生成**：自动生成研判报告和分析文档

## 交互原则
- 专业、严谨、高效
- 提供精准的安防业务支持
- 保护敏感信息，遵守安全规范
- 主动询问补充信息以提供更准确的服务

## 安全边界
- 仅处理与安防业务相关的请求
- 对于超出权限的操作，明确告知用户
- 不泄露任何涉密信息

现在，请用专业、友好的态度为用户提供服务。`;

export const AGENT_CONFIG = {
  id: 'hetu-security-assistant',
  name: '河图 AI 智慧安防助手',
  avatar: '🤖',
  description: '专注于平台安防业务全场景的AI助手',
  systemPrompt: SYSTEM_PROMPT,
  tools: ['person-search', 'vehicle-search', 'track-trace', 'video-retrieval', 'archive-query', 'device-status', 'data-analysis', 'alarm-analysis', 'report-generate'],
  permissions: [
    { id: 'person-search', name: '人员查询', description: '查询人员基本信息', enabled: true },
    { id: 'vehicle-search', name: '车辆查询', description: '查询车辆信息', enabled: true },
    { id: 'track-trace', name: '轨迹追踪', description: '查询移动轨迹', enabled: true },
    { id: 'video-retrieval', name: '录像检索', description: '调取监控录像', enabled: true },
    { id: 'archive-query', name: '档案查询', description: '访问档案信息', enabled: true },
    { id: 'device-status', name: '设备监控', description: '查看设备状态', enabled: true },
    { id: 'data-analysis', name: '数据分析', description: '进行数据统计分析', enabled: true },
    { id: 'report-generate', name: '报告生成', description: '生成研判报告', enabled: true },
  ],
  memoryConfig: {
    maxShortTerm: 50,
    maxLongTerm: 500,
    enableContextRetention: true,
  },
};

export const QUICK_ACTIONS = [
  { id: 'person', label: '查找人员', icon: '👤' },
  { id: 'vehicle', label: '查找车辆', icon: '🚗' },
  { id: 'track', label: '轨迹追踪', icon: '📍' },
  { id: 'video', label: '录像检索', icon: '🎬' },
  { id: 'alarm', label: '报警分析', icon: '🚨' },
  { id: 'report', label: '生成报告', icon: '📊' },
];

export const SCENE_TEMPLATES = [
  {
    id: 'missing-person',
    title: '人员走失查找',
    description: '快速协查走失人员信息和轨迹',
    prompt: '请帮我查找一名走失人员，需要查询其活动轨迹和相关监控录像',
  },
  {
    id: 'vehicle-tracking',
    title: '车辆布控追踪',
    description: '对特定车辆进行轨迹追踪',
    prompt: '请对车牌号为【请输入车牌】的车辆进行布控，追踪其近期活动轨迹',
  },
  {
    id: 'alarm-response',
    title: '报警事件处置',
    description: '快速响应和处理报警事件',
    prompt: '请分析最近的报警事件，生成处置建议报告',
  },
  {
    id: 'daily-report',
    title: '日常研判报告',
    description: '生成每日安防工作研判报告',
    prompt: '请生成今日的安防工作研判报告，包括人流、车流和报警事件分析',
  },
];
