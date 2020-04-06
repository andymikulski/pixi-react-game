export class StateMachine {
  public current:State;

  public onFrame(dt:number){
    this.current.update(dt);
  }
}


export abstract class State {
  abstract update(delta:number):void;
}
