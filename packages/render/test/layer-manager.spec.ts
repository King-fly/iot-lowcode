import {Layer, LayerManager} from '@d/render';

describe('layer module', () => {
    it('should ', () => {
        // @ts-ignore
        const l1 = Layer.create();
        // @ts-ignore
        const l2 = Layer.create();
        // @ts-ignore
        const l3 = Layer.create();
        // @ts-ignore
        const l4 = Layer.create();
        // @ts-ignore
        const l5 = Layer.create();
        // @ts-ignore
        const l6 = Layer.create();
        // @ts-ignore
        const l7 = Layer.create();
        // @ts-ignore
        const l8 = Layer.create();
        // @ts-ignore
        l1.name = 1;
        // @ts-ignore
        l2.name = 2;
        // @ts-ignore
        l3.name = 3;
        // @ts-ignore
        l4.name = 4;
        // @ts-ignore
        l5.name = 5;
        // @ts-ignore
        l6.name = 6;
        // @ts-ignore
        l7.name = 7;
        // @ts-ignore
        l7.id = '7';
        // @ts-ignore
        l8.name = 8;
        
        const layerManager = LayerManager
            .getInstance();
        
        
        layerManager
        // @ts-ignore
            .add(l1)
            .add(l2)
            .add(l3)
            .add(l4)
            .add(l5)
            .add(l6.setSelected())
            .add(l7.setSelected())
            .add(l8)
            .group();

        // @ts-ignore
        expect(layerManager.layerList.length).toEqual(7);
        // @ts-ignore
        expect(layerManager.selectById('7').id).toEqual('7');
        
    });
});