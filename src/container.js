export class Container {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.singletons = new Map();
  }

  register(name, factory, singleton = true) {
    this.factories.set(name, { factory, singleton });
  }

  get(name) {
    const registration = this.factories.get(name);
    if (!registration) throw new Error(`Service ${name} not registered`);

    if (registration.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, registration.factory(this));
      }
      return this.singletons.get(name);
    }

    return registration.factory(this);
  }

  clear() {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
}