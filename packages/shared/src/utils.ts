import {LOG_LEVEL} from './constants';

class Utils {

    static genUUID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

class Emitter {

    public callbacks: any[]

    static create(...args: any[]) {
        return new this(...args);
    }

    constructor(...args: any[]) {
        this.callbacks = [];
    }
    on(type: any, ...callbacks: any[]) {
        if (!this.callbacks[type]) {
            this.callbacks[type] = [];
        }
        this.callbacks[type].push(...callbacks);
        return this;
    }
    off(type: any, callback: any) {
        if (!this.callbacks[type]) {
            return null;
        }
        this.callbacks[type].forEach((iCb: any, index: number) => {
            if (iCb === callback) {
                this.callbacks[type].splice(index, 1);
            }
        })
        return this;
    }

    trigger(event: {type: any}) {
        if (!this.callbacks[event.type]) {
            return null;
        }
        const caughtErrors: any= [];
        this.callbacks[event.type].forEach((callback: any) => {
            try {
                callback(event);
            } catch (error) {
                caughtErrors.push(error)
            }
        });

        if (caughtErrors.length) {
            console.error(`${event.type} error:`, caughtErrors);
        }
        return this;
    }
}

class Log {

    private static _level: string;

    private static _LEVEL: string;

    static LEVEL = LOG_LEVEL || '';

    static set level(level) {
        this._level = level;
    }

    static get level() {
        return this._LEVEL || this.LEVEL;
    }

    static error(cat: string, msg?: string, ext?: object) {
        const level = 'error';
        if (!this.level.includes(level)) return;
        const log = {
            cat,
            level,
            msg,
            ext
        };
        console.groupCollapsed('Designer error: ', msg);
        console.trace(log);
        console.groupEnd();
    }

    static debug(cat: string, msg?: string, ext?: object) {
        const level = 'debug';
        if (!this.level.includes(level)) return;
        const log = {
            cat,
            level,
            msg,
            ext
        };
        console.groupCollapsed('Designer debug: ', msg);
        console.trace(log);
        console.groupEnd();
    }

    static warning(cat: string, msg?: string, ext?: object) {
        const level = 'warn';
        if (!this.level.includes(level)) return;
        const log = {
            cat,
            level: 'warn',
            msg,
            ext
        };
        console.groupCollapsed('Designer warn: ', msg);
        console.trace(log);
        console.groupEnd();
    }
}


export {
    Utils,
    Emitter,
    Log
};
