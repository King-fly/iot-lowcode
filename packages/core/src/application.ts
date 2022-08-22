import {DesignerManager} from './designer-manager';

class Application {
    static boot() {
        DesignerManager.create();
        return this;    
    }
    static run() {
        return this;
    }
}

Application
    .boot()
    .run();

export {
    Application
}
