// index.d.ts
export {};

export declare namespace efml {
  interface VarPool  { [key: string]: any; }
  interface FuncPool {
    [name: string]: {
      html: string;
      execute(params?: Record<string, any>): string;
    };
  }
  interface GlobalStore {
    vars: VarPool;
    funcs: FuncPool;
  }
}

declare global {
  interface Window {
    setGlobalVar(name: string, value: any): void;
    globalStore: eshtml.GlobalStore;
  }

  interface SetVarElement extends HTMLElement {
    readonly dataset: DOMStringMap & { name: string };
  }
  interface GlobalVarElement extends HTMLElement {
    readonly dataset: DOMStringMap & { name: string };
  }
  interface DefFuncElement extends HTMLElement {
    readonly dataset: DOMStringMap & { name: string };
  }
  interface ExecFuncElement extends HTMLElement {
    readonly dataset: DOMStringMap & { name: string; params?: string };
  }
  interface IfJumElement extends HTMLElement {
    readonly dataset: DOMStringMap & { exp?: string };
  }
  interface ElifJumElement extends HTMLElement {
    readonly dataset: DOMStringMap & { exp?: string };
  }
  interface ElseJumElement extends HTMLElement {}
  interface WhileLoopElement extends HTMLElement {
    readonly dataset: DOMStringMap & { exp?: string };
  }
  interface ForLoopElement extends HTMLElement {
    readonly dataset: DOMStringMap & { init?: string; exp?: string; update?: string };
  }

  interface HTMLElementTagNameMap {
    'set-var':    SetVarElement;
    'global-var': GlobalVarElement;
    'def-func':   DefFuncElement;
    'exec-func':  ExecFuncElement;
    'if-jum':     IfJumElement;
    'elif-jum':   ElifJumElement;
    'else-jum':   ElseJumElement;
    'while-loop': WhileLoopElement;
    'for-loop':   ForLoopElement;
  }
}

declare module '*.efml' {
  const html: string;
  export default html;
}