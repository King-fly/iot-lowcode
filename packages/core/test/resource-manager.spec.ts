import {ResourceManager} from '../src/resource-manager';

describe('resource manager module', () => {
    it('resource manager init', () => {
        const img = ResourceManager
            .getSrc('image')
            .create({
                srcMap: {
                    default: {
                        name: 'button-default',
                        fileSize: '',
                        thumbPath: '',
                        srcPath: '',
                        width: '',
                        height: ''
                    },
                    pressed: {
                        name: 'button-pressed',
                        fileSize: '',
                        thumbPath: '',
                        srcPath: '',
                        width: '',
                        height: ''
                    },
                    selected: {
                        name: 'button-selected',
                        fileSize: '',
                        thumbPath: '',
                        srcPath: '',
                        width: '',
                        height: ''
                    },
                    disabled: {
                        name: 'button-disabled',
                        fileSize: '',
                        thumbPath: '',
                        srcPath: '',
                        width: '',
                        height: ''
                    }
                }
            })
        expect(img.contentType).toEqual('image');
    });
});