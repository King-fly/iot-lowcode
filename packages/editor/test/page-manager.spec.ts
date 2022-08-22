import {PageManager, Page} from '../src/page-manager';

describe('page manager module', () => {
    it('page manager init', () => {        
        const PageManagerInstance = PageManager
            // @ts-ignore
            .getInstance()

        const p1 = Page
            .create({name: 'cus1'});

        const p2 = Page
            .create({name: 'cus2'});

        const p3 = Page
            .create({name: 'cus3'});

        PageManagerInstance
        // @ts-ignore
            .addPage(p1)
            .addPage(p2)
            .addPage(p3
                .setHomePage()
                .setSelected())

        PageManagerInstance
        // @ts-ignore
            .delPage(p1);

        // @ts-ignore
        expect(PageManagerInstance.pageList.length).toEqual(2);
    });
});