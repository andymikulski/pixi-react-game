export default class PubSubSystem {
  bindings: { [evtName: string]: Function[] } = {};
  onceBindings: { [evtName: string]: Function[] } = {};

  public on(evtName: string, cb: Function) {
    this.bindings[evtName] = this.bindings[evtName] || [];
    this.bindings[evtName].push(cb);
  }

  public once(evtName: string, cb: Function) {
    this.onceBindings[evtName] = this.onceBindings[evtName] || [];
    this.onceBindings[evtName].push(cb);
  }

  public trigger(evtName: string, ...data: any[]) {
    const handlers = (this.bindings[evtName] || []).concat(this.onceBindings[evtName] || []);

    for (let i = 0; i < handlers.length; i++) {
      handlers[i](...data);
    }

    this.onceBindings[evtName] = [];
  }
}