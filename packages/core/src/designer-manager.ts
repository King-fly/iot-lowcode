import { Log } from '@d/shared/src/utils';
import {
    ToolsPanel,
    CanvasPanel,
    DebugPanel,
    SetterPanel,
    MaterialPanel,
    Skeleton
} from './skeleton';
import {Designer} from './designer';

class SkeletonLayer {
    static loader() {
        Skeleton
            .of()
            .add(ToolsPanel.create())
            .add(CanvasPanel.create())
            .add(DebugPanel.create())
            .add(SetterPanel.create())
            .add(MaterialPanel.create())
            .builder()
            .loader()
        Log.debug('designer manager', '[SkeletonLayer] loader success!')
    }
}

class DesignerLayer {
    static loader() {
        Designer.start();
        Log.debug('designer manager', '[DesignerLayer] loader success!')
    }
}

class DesignerManager {
    static Skeleton = SkeletonLayer;
    static Designer = DesignerLayer;

    static create() {
        [this.Skeleton, this.Designer]
            .forEach(context => context.loader());
    }
}

export {
    DesignerManager
};
