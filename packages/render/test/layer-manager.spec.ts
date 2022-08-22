import {
    Layer,
    LayerManager
} from '../src/layer-manager.js';

describe('layer module', () => {
    it('should ', () => {

        const l1 = Layer.create();
        const l2 = Layer.create();
        const l3 = Layer.create();
        const l4 = Layer.create();
        const l5 = Layer.create();
        const l6 = Layer.create();
        const l7 = Layer.create();
        const l8 = Layer.create();
        
        l1.name = 1;
        l2.name = 2;
        l3.name = 3;
        l4.name = 4;
        l5.name = 5;
        l6.name = 6;
        l7.name = 7;
        l7.id = '7';
        l8.name = 8;
        
        const layerManager = LayerManager
            .getInstance();
        
        
        layerManager
            .add(l1)
            .add(l2)
            .add(l3)
            .add(l4)
            .add(l5)
            .add(l6.setSelected())
            .add(l7.setSelected())
            .add(l8)
            .group();

        expect(layerManager.layerList.length).toEqual(7);
        expect(layerManager.selectById('7').id).toEqual('7');
        
    });
});