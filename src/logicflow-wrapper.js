// 导入 UMD 模块
import '../src/index.min.js';

// 从全局对象中获取 LogicFlow（UMD 模块在浏览器中暴露为 window.Core）
const LogicFlow = window.Core.LogicFlow || window.Core;

export default LogicFlow;
