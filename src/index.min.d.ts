// LogicFlow 类型声明
declare module './index.min.js' {
  class LogicFlow {
    constructor(options: any);
    render(data: any): void;
    on(event: string, callback: Function): void;
    getSelectElements(includeEdges?: boolean): any;
    extension: any;
  }
  
  // UMD 导出
  namespace Core {
    class LogicFlow {
      constructor(options: any);
      render(data: any): void;
      on(event: string, callback: Function): void;
      getSelectElements(includeEdges?: boolean): any;
      extension: any;
    }
  }
  
  export = Core;
}

// 包装文件类型声明
declare module './logicflow-wrapper.js' {
  class LogicFlow {
    constructor(options: any);
    render(data: any): void;
    on(event: string, callback: Function): void;
    getSelectElements(includeEdges?: boolean): any;
    extension: any;
  }
  
  export default LogicFlow;
}

// 全局类型声明
declare global {
  interface Window {
    Core: {
      LogicFlow: any;
      [key: string]: any;
    };
  }
}

export {};
