<template>
  <div class="app">
    <!-- 切换按钮区域 -->
    <div class="header">
      <div class="toggle-group">
        <label>引入方式：</label>
        <button 
          :class="['toggle-btn', { active: useLocalFile }]"
          @click="switchToLocal"
        >
          📁 本地文件
        </button>
        <button 
          :class="['toggle-btn', { active: !useLocalFile }]"
          @click="switchToNpm"
        >
          📦 NPM 包
        </button>
      </div>
      <div class="status">
        <span class="status-text">当前: {{ useLocalFile ? '本地文件引入' : 'NPM包引入' }}</span>
        <span class="status-indicator" :class="{ 'status-local': useLocalFile, 'status-npm': !useLocalFile }"></span>
      </div>
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-wrapper">
      <div class="container" ref="container"></div>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在切换引入方式...</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
// 引入 LogicFlow 样式
import "@logicflow/core/lib/style/index.css";

// 通过 文件 引入的 LogicFlow
import "./index.min.css";

const container = ref<HTMLElement | null>(null);
const useLocalFile = ref(true);
const loading = ref(false);

// 动态导入 LogicFlow
const loadLogicFlow = async () => {
  loading.value = true;
  
  try {
    let LogicFlow;
    
    if (useLocalFile.value) {
      // 本地文件方式
      const wrapper = await import("./logicflow-wrapper.js");
      LogicFlow = wrapper.default;
    } else {
      // NPM 包方式
      const core = await import("@logicflow/core");
      LogicFlow = core.default;
      
      // 如果使用 npm 包，需要导入样式
    }
    
    // 清空容器
    if (container.value) {
      container.value.innerHTML = "";
    }
    
    // 等待 DOM 更新
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 初始化 LogicFlow
    initLogicFlow(LogicFlow);
  } catch (error) {
    console.error("切换引入方式失败:", error);
    alert(`切换失败: ${error}`);
  } finally {
    loading.value = false;
  }
};

const initLogicFlow = (LogicFlow: any) => {
  if (!container.value) return;
  
  const lf = new LogicFlow({
    container: container.value,
    grid: {
      size: 20,
      config: {
        color: "#c9d3dd",
        thickness: 1.2,
      },
    },
    nodeTextEdit: false,
    snapline: false,
    edgeType: "bezier",
    background: {
      backgroundColor: "#eef1f5",
    },
    keyboard: {
      enabled: true,
    },
  });

  // 监听节点点击事件
  lf.on("node:click", () => {
    const elements = lf.getSelectElements(true);
    console.log("选中元素:", elements);
  });

  // 渲染流程图
  lf.render({
    nodes: [
      {
        id: '21',
        type: 'rect',
        x: 100,
        y: 100,
        text: 'Origin Usage-rect',
        properties: {
          width: 160,
          height: 80,
        },
      },
      {
        id: '50',
        type: 'circle',
        x: 300,
        y: 300,
        text: 'Origin Usage-circle',
        properties: {
          r: 60,
        },
      },
    ],
    edges: [
      {
        id: 'rect-2-circle',
        type: 'polyline',
        sourceNodeId: '50',
        targetNodeId: '21',
      },
    ],
  });
};

const switchToLocal = async () => {
  if (useLocalFile.value) return;
  useLocalFile.value = true;
  await loadLogicFlow();
};

const switchToNpm = async () => {
  if (!useLocalFile.value) return;
  useLocalFile.value = false;
  await loadLogicFlow();
};

onMounted(async () => {
  await loadLogicFlow();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

/* 头部区域 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.toggle-group label {
  color: #333;
  font-size: 14px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #f0f9ff;
}

.toggle-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 状态指示 */
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.status-text {
  font-weight: 500;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.status-local {
  background: #67c23a;
  box-shadow: 0 0 6px rgba(103, 194, 58, 0.5);
}

.status-indicator.status-npm {
  background: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 编辑器容器 */
.editor-wrapper {
  flex: 1;
  position: relative;
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: white;
}

.container {
  height: 100%;
}

/* 加载动画 */
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 999;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* 底部区域 */
.footer {
  padding: 12px 24px;
  background: white;
  border-top: 1px solid #e0e0e0;
  font-size: 13px;
  color: #666;
}

.info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 12px;
  }

  .toggle-group {
    width: 100%;
    justify-content: center;
  }

  .container {
    height: 500px;
  }
}
</style>
