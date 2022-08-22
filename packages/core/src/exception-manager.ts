import { Log } from '@d/shared/src/utils';
class ExceptionManager {
    static LOG_STORE = {}

    public static exceptionInstance: object;

    static getInstance() {
        if (!ExceptionManager.exceptionInstance) {
            ExceptionManager.exceptionInstance = this.create();
        }
        return ExceptionManager.exceptionInstance;
    }

    static create() {
        return new ExceptionManager()
    }

    constructor() {}
    
    // window.onerror
    windowOnError(errorHandler = () => {}) {
        window.addEventListener('error', event => {
            Log.error(event.message)
            errorHandler.call(this)
        })
        return this
    }

    // cross origin script error
    wrapperOriginEventListener(errorHandler = () => {}) {
        const originAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener: () => {}, options) {
            const wrapper = function (...args: []) {
                try {
                    return listener.apply(undefined, args);
                }
                catch (error) {
                    errorHandler.call(undefined)
                    throw error
                }
            }
            return originAddEventListener.call(this, type, wrapper, options)
        }
        return this
    }
    wrapperError(fn: any | unknown, errorHandler = () => {}) {
        if (!fn.__wrapper) {
            fn.__wrapper = (...args: []) => {
                try {
                    return fn.apply(this, args)
                }
                catch (error: any) {
                    errorHandler.call(this)
                    Log.error(`wrapper error: ${error.message}`)
                }
            }
        }
        return fn.__wrapper
    }
    vueErrorHandler() {}

    vueErrorCapture() {}
}

export {
    ExceptionManager
};
