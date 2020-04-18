declare class StateMachine {
    constructor(options: Partial<StateMachine.Options>);
    static factory(options: Partial<StateMachine.Options>): StateMachine.MachineFactory;
    static factory<T>(instance: T, options: Partial<StateMachine.Options>): StateMachine.MachineFactory | T;
  }
  
  declare namespace StateMachine {
    interface StateValue {
      state: string
    }
    
    interface StateAction {
      [action: string]: ((...args: any[]) => any);
      is: StateMachine.StateMachineIs;
      can: StateMachine.StateMachineCan;
      cannot: StateMachine.StateMachineCan;
      transitions: StateMachine.StateMachineTransitions;
      allTransitions: StateMachine.StateMachineTransitions;
      allStates: StateMachine.StateMachineStates;
      observe: StateMachine.Observe;
      clearHistory(): void;
      historyBack(): void;
      historyForward(): void;
      canHistory(): boolean;
      canHistoryBack(): boolean;
      canHistoryForward(): boolean;
    }
  
    type State = StateValue & StateAction;
    type StateMachineIs = (state: string) => boolean;
    type StateMachineCan = (evt: string) => boolean;
    type StateMachineTransitions = () => string[];
    type StateMachineStates = () => string[];
    type Callback = (...args: any[]) => any;
    interface Observe {
      (event: string, callback: Callback): void;
      [name: string]: Callback;
    }
  
    interface LifeCycle {
      transition: string;
      from: string;
      to: string;
    }
  
    interface Transition {
      name: string;
      from: string | string[] | '*';
      to: string | ((...args: any[]) => string);
    }
  
    interface Options {
      name: string;
      past: string;
      future: string;
      init: string;
      max: number;
      state: string;
      transitions: Transition[];
      methods: {
        [method: string]: Callback | undefined;
        onBeforeTransition?(lifecycle: LifeCycle, ...args: any[]): boolean | Promise<boolean>;
        onLeaveState?(lifecycle: LifeCycle, ...args: any[]): boolean | Promise<boolean>;
        onTransition?(lifecycle: LifeCycle, ...args: any[]): boolean | Promise<boolean>;
        onEnterState?(lifecycle: LifeCycle, ...args: any[]): any | Promise<any>;
        onAfterTransition?(lifecycle: LifeCycle, ...args: any[]): any | Promise<any>;
        onPendingTransition?(transition: string, from: string, to: string): any | Promise<any>;
      };
      data: any;
      plugins: any[];
    }
  
    interface MachineFactory {
      new(...data: any[]): State;
    }
  }
  
  export = StateMachine;
  export as namespace StateMachine;