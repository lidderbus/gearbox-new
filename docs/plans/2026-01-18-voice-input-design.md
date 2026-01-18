# 语音输入功能设计

> **日期**: 2026-01-18
> **状态**: 已确认，待实现
> **适用范围**: 移动端响应式选型界面

## 概述

为齿轮箱选型表单添加语音输入功能，用户点击麦克风按钮后说出参数，系统自动识别并填充功率、转速、速比字段。

## 设计目标

1. 一次语音识别所有参数
2. 支持带关键词的自然语言输入
3. 浏览器不支持时优雅降级
4. 清晰的状态反馈

## UI设计

### 麦克风按钮位置

在核心参数输入区旁边添加语音按钮：

```
┌─────────────────────────────────────┐
│ 齿轮箱类型: [HC系列 ▼]              │
├─────────────────────────────────────┤
│ 功率      转速      速比    [🎤]    │  ← 麦克风按钮
│ [___]kW  [___]rpm  [___]           │
│                                     │
│ 常用速比: [2] [2.5] [3] [4]         │
└─────────────────────────────────────┘
```

### 按钮状态

| 状态 | 图标 | 样式 |
|------|------|------|
| 待机 | 🎤 灰色 | 圆形边框按钮 |
| 录音中 | 🎤 红色 + 脉冲动画 | 红色填充 + 波纹扩散 |
| 识别中 | ⏳ 旋转 | 加载动画 |
| 成功 | ✓ 绿色 | 1秒后恢复待机 |
| 失败 | ✕ 红色 | 显示错误提示 |

### 录音中浮层

```
┌─────────────────────────────────────┐
│                                     │
│           🎤 正在聆听...            │
│         ~~~~~~~~~~~~                │  ← 音量波形
│                                     │
│    请说: "功率200千瓦，转速1500转，  │
│           速比2.5"                  │
│                                     │
│           [ 取消 ]                  │
└─────────────────────────────────────┘
```

## 语音识别

### 支持的语音格式

```
"功率200千瓦，转速1500转，速比2.5"
"功率200，转速1500，速比2.5"
"200千瓦，1500转，2.5倍"
```

### 关键词匹配规则

| 参数 | 关键词 | 单位词 | 示例 |
|------|--------|--------|------|
| 功率 | 功率、马力、千瓦 | 千瓦、kw | "功率200千瓦" |
| 转速 | 转速、转、rpm | 转、rpm | "转速1500转" |
| 速比 | 速比、比、减速比 | 倍、比1 | "速比2.5" |

### 提取正则表达式

```javascript
const patterns = {
  power: /(?:功率|马力)?(\d+(?:\.\d+)?)\s*(?:千瓦|kw)?/i,
  speed: /(?:转速)?(\d+)\s*(?:转|rpm)?/i,
  ratio: /(?:速比|减速比)?(\d+(?:\.\d+)?)\s*(?:倍)?/i
};
```

### 识别流程

```
用户说话 → Web Speech API 转文字
    ↓
"功率200千瓦，转速1500转，速比2.5"
    ↓
正则提取: power=200, speed=1500, ratio=2.5
    ↓
填充表单 + 显示"已识别: 200kW, 1500rpm, 2.5"
```

### 部分识别处理

如果只识别到部分参数：
- 填充已识别的参数
- 提示"已识别功率和转速，请手动输入速比"

## 兼容性

### Web Speech API 支持情况

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome (Android/iOS) | ✓ 完全支持 |
| Safari (iOS) | ✓ iOS 14.5+ |
| Firefox | ✗ 不支持 |
| 微信内置浏览器 | ⚠️ 部分支持 |

### 不支持时的处理

```javascript
const isSpeechSupported = 'webkitSpeechRecognition' in window
                       || 'SpeechRecognition' in window;

// 不支持时隐藏麦克风按钮
if (!isSpeechSupported) {
  return null; // 不渲染按钮
}
```

## 错误处理

### 错误类型与提示

| 错误 | 用户提示 |
|------|----------|
| 无麦克风权限 | "请允许使用麦克风" |
| 网络错误 | "网络连接失败，请重试" |
| 无法识别 | "未能识别，请重新说一遍" |
| 超时(5秒) | "识别超时，请重试" |

### 权限请求流程

```
点击麦克风
    ↓
首次使用 → 浏览器弹出权限请求
    ↓
允许 → 开始录音
拒绝 → 显示"请在设置中允许麦克风权限"
```

## 技术实现

### 新增组件

```
src/components/responsive/
├── VoiceInputButton.js     # 语音输入按钮组件
└── VoiceInputButton.css
```

### 核心代码结构

```javascript
// VoiceInputButton.js
import { useState, useRef } from 'react';

const VoiceInputButton = ({ onResult }) => {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setStatus('listening');
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      parseAndFill(transcript);
    };
    recognition.onerror = (event) => handleError(event.error);
    recognition.onend = () => {
      if (status === 'listening') setStatus('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();

    // 5秒超时
    setTimeout(() => {
      if (status === 'listening') {
        recognition.stop();
        setStatus('error');
        setErrorMsg('识别超时，请重试');
      }
    }, 5000);
  };

  const parseAndFill = (transcript) => {
    setStatus('processing');

    const result = {
      power: null,
      speed: null,
      ratio: null
    };

    // 功率匹配
    const powerMatch = transcript.match(/(?:功率|马力)?(\d+(?:\.\d+)?)\s*(?:千瓦|kw)?/i);
    if (powerMatch) result.power = parseFloat(powerMatch[1]);

    // 转速匹配
    const speedMatch = transcript.match(/(?:转速)?(\d+)\s*(?:转|rpm)?/i);
    if (speedMatch) result.speed = parseInt(speedMatch[1]);

    // 速比匹配
    const ratioMatch = transcript.match(/(?:速比|减速比)?(\d+(?:\.\d+)?)\s*(?:倍)?/i);
    if (ratioMatch) result.ratio = parseFloat(ratioMatch[1]);

    if (result.power || result.speed || result.ratio) {
      setStatus('success');
      onResult(result);
      setTimeout(() => setStatus('idle'), 1000);
    } else {
      setStatus('error');
      setErrorMsg('未能识别参数，请重试');
    }
  };

  // ... render
};
```

### 与ResponsiveSelectionForm集成

```javascript
// ResponsiveSelectionForm.js
import VoiceInputButton from './VoiceInputButton';

// 在核心参数区添加
<VoiceInputButton
  onResult={({ power, speed, ratio }) => {
    if (power) setPower(power);
    if (speed) setSpeed(speed);
    if (ratio) setRatio(ratio);
  }}
/>
```

## 依赖

- 无新增依赖
- 使用原生 Web Speech API

## 实现优先级

此功能可作为响应式选型界面的后续优化，建议在响应式表单完成后实现。

**预计工作量：**
- VoiceInputButton: ~150行
- CSS动画: ~50行
- 集成修改: ~20行
- 总计: ~220行
