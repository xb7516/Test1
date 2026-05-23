export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function extractIntent(message: string): { intent: string; confidence: number; slots: Record<string, any> } {
  const lowerMessage = message.toLowerCase();
  
  const patterns = [
    { intent: 'person-search', keywords: ['查找人', '找人', '人员', '张三', '身份证'], confidence: 0.85 },
    { intent: 'vehicle-search', keywords: ['查找车', '找车', '车辆', '车牌', '京A'], confidence: 0.85 },
    { intent: 'track-trace', keywords: ['轨迹', '追踪', '路线', '去哪了'], confidence: 0.8 },
    { intent: 'video-retrieval', keywords: ['录像', '视频', '回放', '监控'], confidence: 0.85 },
    { intent: 'alarm-analysis', keywords: ['报警', '告警', '事件', '异常'], confidence: 0.9 },
    { intent: 'report-generate', keywords: ['报告', '生成', '总结', '研判'], confidence: 0.85 },
    { intent: 'data-analysis', keywords: ['统计', '数据', '分析', '人流', '车流'], confidence: 0.8 },
    { intent: 'device-status', keywords: ['设备', '状态', '在线', '离线', '故障'], confidence: 0.85 },
  ];

  let bestMatch = { intent: 'unknown', confidence: 0, slots: {} };
  
  for (const pattern of patterns) {
    const matchCount = pattern.keywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      const confidence = pattern.confidence * (0.5 + matchCount * 0.1);
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent: pattern.intent,
          confidence: Math.min(confidence, 1),
          slots: {},
        };
      }
    }
  }

  return bestMatch;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
