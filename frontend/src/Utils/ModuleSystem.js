// Central Module System Manager
export class ModuleSystem {
  constructor() {
    this.modules = new Map();
    this.dependencies = new Map();
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
  }

  // Register a module
  register(name, module, dependencies = []) {
    this.modules.set(name, module);
    this.dependencies.set(name, dependencies);
  }

  // Load a module with its dependencies
  async load(name) {
    // Return if already loaded
    if (this.loadedModules.has(name)) {
      return this.modules.get(name);
    }

    // Return existing promise if currently loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    // Create loading promise
    const loadingPromise = this._loadModule(name);
    this.loadingPromises.set(name, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.add(name);
      return module;
    } finally {
      this.loadingPromises.delete(name);
    }
  }

  // Internal method to load module with dependencies
  async _loadModule(name) {
    const dependencies = this.dependencies.get(name) || [];
    
    // Load all dependencies first
    for (const dependency of dependencies) {
      await this.load(dependency);
    }

    // Load the module
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module '${name}' not found`);
    }

    // If module is a function, execute it
    if (typeof module === 'function') {
      return module();
    }

    return module;
  }

  // Load multiple modules
  async loadMultiple(names) {
    const promises = names.map(name => this.load(name));
    return Promise.all(promises);
  }

  // Check if module is loaded
  isLoaded(name) {
    return this.loadedModules.has(name);
  }

  // Get module (synchronous, only if loaded)
  get(name) {
    if (!this.isLoaded(name)) {
      throw new Error(`Module '${name}' is not loaded`);
    }
    return this.modules.get(name);
  }

  // Unload module
  unload(name) {
    this.loadedModules.delete(name);
    this.loadingPromises.delete(name);
  }

  // Clear all modules
  clear() {
    this.modules.clear();
    this.dependencies.clear();
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// Module Factory for creating lazy-loaded modules
export class ModuleFactory {
  static createLazyModule(loader, dependencies = []) {
    return () => loader();
  }

  static createAsyncModule(asyncLoader, dependencies = []) {
    return async () => {
      await ModuleSystem.getInstance().loadMultiple(dependencies);
      return await asyncLoader();
    };
  }

  static createSingletonModule(factory, dependencies = []) {
    let instance = null;
    return () => {
      if (instance === null) {
        instance = factory();
      }
      return instance;
    };
  }
}

// Service Container for dependency injection
export class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
  }

  // Register a service
  register(name, factory, options = {}) {
    const { singleton = false, dependencies = [] } = options;
    
    this.factories.set(name, { factory, dependencies, singleton });
    
    if (singleton) {
      this.singletons.set(name, null);
    }
  }

  // Get a service
  get(name) {
    const factoryInfo = this.factories.get(name);
    if (!factoryInfo) {
      throw new Error(`Service '${name}' not registered`);
    }

    const { factory, dependencies, singleton } = factoryInfo;

    // Return singleton instance if exists
    if (singleton && this.singletons.get(name) !== null) {
      return this.singletons.get(name);
    }

    // Load dependencies
    const resolvedDependencies = dependencies.map(dep => this.get(dep));

    // Create instance
    const instance = factory(...resolvedDependencies);

    // Store singleton instance
    if (singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  // Check if service is registered
  has(name) {
    return this.factories.has(name);
  }

  // Clear all services
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
}

// Event Bus for module communication
export class EventBus {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to event
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Subscribe to event once
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    return this.on(event, onceCallback);
  }

  // Unsubscribe from event
  off(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event
  emit(event, data) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for '${event}':`, error);
        }
      });
    }
  }

  // Clear all events
  clear() {
    this.events.clear();
  }
}

// Module Registry for managing all modules
export class ModuleRegistry {
  constructor() {
    this.moduleSystem = new ModuleSystem();
    this.serviceContainer = new ServiceContainer();
    this.eventBus = new EventBus();
    this.config = new Map();
  }

  // Get singleton instance
  static getInstance() {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  // Configure module
  configure(name, config) {
    this.config.set(name, config);
  }

  // Get configuration
  getConfig(name) {
    return this.config.get(name);
  }

  // Register module with dependencies
  registerModule(name, moduleFactory, dependencies = []) {
    this.moduleSystem.register(name, moduleFactory, dependencies);
  }

  // Load module
  async loadModule(name) {
    return this.moduleSystem.load(name);
  }

  // Register service
  registerService(name, factory, options = {}) {
    this.serviceContainer.register(name, factory, options);
  }

  // Get service
  getService(name) {
    return this.serviceContainer.get(name);
  }

  // Subscribe to event
  on(event, callback) {
    return this.eventBus.on(event, callback);
  }

  // Emit event
  emit(event, data) {
    this.eventBus.emit(event, data);
  }

  // Initialize all modules
  async initialize() {
    this.emit('system:initializing');
    
    try {
      // Load core modules first
      await this.moduleSystem.loadMultiple([
        'config',
        'logger',
        'api'
      ]);
      
      this.emit('system:initialized');
    } catch (error) {
      this.emit('system:error', error);
      throw error;
    }
  }
}

// Module Loader for dynamic imports
export class ModuleLoader {
  constructor(basePath = '/') {
    this.basePath = basePath;
    this.cache = new Map();
  }

  // Load module dynamically
  async load(modulePath) {
    const fullPath = `${this.basePath}${modulePath}`;
    
    // Check cache first
    if (this.cache.has(fullPath)) {
      return this.cache.get(fullPath);
    }

    try {
      const module = await import(fullPath);
      this.cache.set(fullPath, module);
      return module;
    } catch (error) {
      console.error(`Failed to load module '${modulePath}':`, error);
      throw error;
    }
  }

  // Load multiple modules
  async loadMultiple(modulePaths) {
    const promises = modulePaths.map(path => this.load(path));
    return Promise.all(promises);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Export utilities
export const createModule = (name, factory, dependencies = []) => {
  return {
    name,
    factory,
    dependencies
  };
};

export const createService = (name, factory, options = {}) => {
  return {
    name,
    factory,
    options
  };
};

// Default export
export default ModuleRegistry;
