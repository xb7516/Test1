export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  tools?: ToolCall[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory;
  params: Record<string, any>;
  handler: (params: any) => Promise<any>;
}

export type ToolCategory = 'search' | 'analysis' | 'tracking' | 'report' | 'device' | 'data';

export interface ToolCall {
  id: string;
  toolId: string;
  params: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  permissions: Permission[];
  memoryConfig: MemoryConfig;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface MemoryConfig {
  maxShortTerm: number;
  maxLongTerm: number;
  enableContextRetention: boolean;
}

export interface Intent {
  id: string;
  name: string;
  confidence: number;
  slots: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'operator' | 'police' | 'security';
  avatar?: string;
  permissions: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  type: 'tool' | 'condition' | 'end';
  toolId?: string;
  condition?: string;
  nextStepId?: string;
}
