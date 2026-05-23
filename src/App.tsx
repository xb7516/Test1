import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Settings, 
  Bot, 
  User, 
  Menu, 
  X, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Zap,
  Shield,
  Database,
  Brain
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Message, ToolCall } from './types';
import { AGENT_CONFIG, QUICK_ACTIONS, SCENE_TEMPLATES } from './constants';
import { tools, getToolById } from './tools';
import { generateId, formatTime, formatDateTime, extractIntent } from './utils';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: '您好！我是河图 AI 智慧安防助手，专注于为您提供全场景安防业务支持。\n\n我可以帮您：\n• 查找人员和车辆信息\n• 追踪移动轨迹\n• 检索监控录像\n• 分析报警事件\n• 生成研判报告\n\n请告诉我您需要什么帮助？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolResult, setToolResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState([
    { id: '1', title: '当前对话', isActive: true },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string = input) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      processUserMessage(userMessage);
    }, 500);
  };

  const processUserMessage = async (userMessage: Message) => {
    const intentResult = extractIntent(userMessage.content);
    
    let responseContent = '';
    let shouldCallTool = false;
    let targetToolId = intentResult.intent;

    if (intentResult.confidence > 0.6 && intentResult.intent !== 'unknown') {
      responseContent = `我理解您的需求，正在为您${getToolById(intentResult.intent)?.name || '处理'}...`;
      shouldCallTool = true;
    } else {
      responseContent = '收到您的请求，请告诉我更多详细信息，或者选择下方的快捷操作。';
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      tools: shouldCallTool ? [
        {
          id: generateId(),
          toolId: targetToolId,
          params: {},
          status: 'pending',
        }
      ] : undefined,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    if (shouldCallTool) {
      await executeToolCall(assistantMessage.id, targetToolId);
    }

    setIsTyping(false);
  };

  const executeToolCall = async (messageId: string, toolId: string) => {
    const tool = getToolById(toolId);
    if (!tool) return;

    setMessages((prev) => prev.map((msg) => 
      msg.id === messageId 
        ? {
            ...msg,
            tools: msg.tools?.map((t) => 
              t.toolId === toolId ? { ...t, status: 'running' } : t
            ),
          }
        : msg
    ));

    try {
      const result = await tool.handler({});
      
      setMessages((prev) => prev.map((msg) => 
        msg.id === messageId 
          ? {
              ...msg,
              content: `已完成${tool.name}，为您找到相关信息：`,
              tools: msg.tools?.map((t) => 
                t.toolId === toolId ? { ...t, status: 'completed', result } : t
              ),
            }
          : msg
      ));

      setActiveTool(toolId);
      setToolResult(result.data);
    } catch (error) {
      setMessages((prev) => prev.map((msg) => 
        msg.id === messageId 
          ? {
              ...msg,
              content: `执行${tool.name}时出现错误，请稍后重试。`,
              tools: msg.tools?.map((t) => 
                t.toolId === toolId ? { ...t, status: 'failed', error: String(error) } : t
              ),
            }
          : msg
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderToolResult = () => {
    if (!activeTool || !toolResult) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 bg-dark-800 border border-dark-600 rounded-xl overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-dark-600 flex items-center justify-between bg-dark-700/50">
          <div className="flex items-center gap-2">
            {getToolById(activeTool)?.icon}
            <span className="font-medium text-sm">{getToolById(activeTool)?.name} 结果</span>
          </div>
          <button 
            onClick={() => { setActiveTool(null); setToolResult(null); }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-80">
            {JSON.stringify(toolResult, null, 2)}
          </pre>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-dark-900 text-white overflow-hidden font-sans">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col border-r border-dark-600 bg-dark-800"
          >
            <div className="p-4 border-b border-dark-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-security-500 flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sm">河图 AI</h1>
                  <p className="text-xs text-gray-400">智慧安防助手</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-dark-600 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3">
              <button 
                onClick={() => {
                  setMessages([{
                    id: generateId(),
                    role: 'assistant',
                    content: '新对话已开始，请告诉我您需要什么帮助？',
                    timestamp: new Date(),
                  }]);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-900/20"
              >
                <Plus size={18} />
                新建对话
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                    session.isActive 
                      ? "bg-dark-600 text-white" 
                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    session.isActive ? "bg-primary-500" : "bg-transparent group-hover:bg-gray-500"
                  )} />
                  <span className="text-sm truncate flex-1">{session.title}</span>
                  {session.isActive && (
                    <MoreVertical size={14} className="opacity-50" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-dark-600 space-y-3">
              <div className="flex items-center gap-3 px-2 py-2 hover:bg-dark-700 rounded-lg cursor-pointer transition-colors">
                <Settings size={18} className="text-gray-400" />
                <span className="text-sm text-gray-300">系统设置</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-2 hover:bg-dark-700 rounded-lg cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                  管
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">管理员</p>
                  <p className="text-xs text-gray-500 truncate">超级管理员</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-dark-600 bg-dark-800/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-dark-700 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-slow" />
              <span className="font-medium">在线服务</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 rounded-full text-xs text-gray-300">
              <Brain size={14} className="text-primary-400" />
              <span>模型: Hetu-v2.0</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 rounded-full text-xs text-gray-300">
              <Database size={14} className="text-security-400" />
              <span>知识库: 已连接</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-900 to-dark-900 pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto w-full p-4 md:p-8 pb-32">
            {messages.length <= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 space-y-8"
              >
                <div className="text-center pt-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-600 to-security-600 flex items-center justify-center shadow-2xl shadow-primary-500/20 animate-float">
                    <Bot size={40} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-white">河图 AI 智慧安防助手</h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    专业、高效、安全的全场景安防业务支持平台
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SCENE_TEMPLATES.map((scene, idx) => (
                    <motion.button
                      key={scene.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      onClick={() => sendMessage(scene.prompt)}
                      className="p-4 text-left bg-dark-800/50 hover:bg-dark-700/80 border border-dark-600 hover:border-primary-500/50 rounded-xl transition-all group"
                    >
                      <h3 className="font-semibold mb-1 text-white group-hover:text-primary-400 transition-colors">
                        {scene.title}
                      </h3>
                      <p className="text-sm text-gray-400">{scene.description}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-1">快捷操作</h3>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((action, idx) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        onClick={() => sendMessage(`我需要${action.label}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 rounded-lg text-sm transition-all"
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-4 max-w-3xl",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                    msg.role === 'user' 
                      ? "bg-gradient-to-br from-blue-500 to-purple-500" 
                      : "bg-gradient-to-br from-primary-600 to-security-600"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className={cn(
                        "font-medium",
                        msg.role === 'user' ? "text-blue-400" : "text-primary-400"
                      )}>
                        {msg.role === 'user' ? '您' : '河图 AI'}
                      </span>
                      <span>•</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>

                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user'
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-dark-700 text-gray-100 rounded-tl-sm border border-dark-600"
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      
                      {msg.tools && msg.tools.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {msg.tools.map((toolCall) => (
                            <ToolCallStatus key={toolCall.id} toolCall={toolCall} />
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === 'assistant' && idx === messages.length - 1 && renderToolResult()}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 max-w-3xl mr-auto"
                  >
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-security-600">
                      <Bot size={16} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-dark-700 rounded-tl-sm border border-dark-600">
                      <div className="flex items-center gap-1.5">
                        <motion.div 
                          animate={{ y: [0, -6, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -6, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -6, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-dark-800/80 backdrop-blur-xl border-t border-dark-600">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 bg-dark-700 rounded-2xl border border-dark-600 focus-within:border-primary-500/50 transition-all shadow-lg">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入您的需求..."
                className="w-full bg-transparent border-none outline-none px-5 py-4 text-white placeholder-gray-500 resize-none max-h-48 min-h-[60px] font-sans"
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="p-3 m-2 bg-primary-600 hover:bg-primary-500 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-primary-900/20"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Zap size={12} className="text-yellow-500" />
                  工具已加载: {tools.length}
                </span>
              </div>
              <div className="hidden md:block">
                按 Enter 发送，Shift + Enter 换行
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-80 flex-col border-l border-dark-600 bg-dark-800">
        <div className="p-4 border-b border-dark-600">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield size={18} className="text-primary-400" />
            Agent 配置
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">角色信息</h4>
            <div className="bg-dark-700/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-security-600 flex items-center justify-center text-xl">
                  {AGENT_CONFIG.avatar}
                </div>
                <div>
                  <p className="font-medium">{AGENT_CONFIG.name}</p>
                  <p className="text-xs text-gray-400">{AGENT_CONFIG.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">可用工具</h4>
            <div className="space-y-2">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                    activeTool === tool.id 
                      ? "bg-primary-900/30 border border-primary-500/30" 
                      : "bg-dark-700/30 hover:bg-dark-700/50 border border-transparent"
                  )}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-primary-400">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tool.name}</p>
                    <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                  </div>
                  {activeTool === tool.id && <CheckCircle2 size={16} className="text-primary-400" />}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">权限控制</h4>
            <div className="space-y-2">
              {AGENT_CONFIG.permissions.map((perm) => (
                <div key={perm.id} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{perm.name}</p>
                    <p className="text-xs text-gray-500">{perm.description}</p>
                  </div>
                  <div className={cn(
                    "w-8 h-4 rounded-full transition-colors flex items-center",
                    perm.enabled ? "bg-primary-600 justify-end" : "bg-dark-600 justify-start"
                  )}>
                    <div className="w-3.5 h-3.5 bg-white rounded-full mx-0.5 shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCallStatus: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const tool = getToolById(toolCall.toolId);
  
  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500 animate-pulse" />;
      case 'running':
        return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Zap size={16} className="text-blue-400" /></motion.div>;
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg border border-dark-600/50">
      {getStatusIcon()}
      <span className="text-xs text-gray-400">
        {tool?.name || '工具'}
      </span>
      <span className="text-xs text-gray-500 ml-auto">
        {toolCall.status === 'pending' && '等待中...'}
        {toolCall.status === 'running' && '执行中...'}
        {toolCall.status === 'completed' && '完成'}
        {toolCall.status === 'failed' && '失败'}
      </span>
    </div>
  );
};

export default App;
