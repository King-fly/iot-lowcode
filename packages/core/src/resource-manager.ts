type ContentType = string

type SrcMap = {
    default?: object;
    pressed?: object;
    selected?: object;
    disabled?: object;
}

type Options = {
    srcMap?: SrcMap
    contentType?: ContentType    
}

class BaseResource {

    static RESOURCE_TYPE = 'base'

    static create(...args: []) {
        return new this(...args)
    }
    public contentType: string | undefined;
    constructor(options: Options = {}) {
        this.contentType = options.contentType ?? BaseResource.RESOURCE_TYPE;
    }
}

class ImageResource extends BaseResource {

    public srcMap: SrcMap;

    static RESOURCE_TYPE = 'image'

    constructor(options: Options = {}) {
        super(options);
        this.srcMap = options.srcMap || {};
        this.contentType = ImageResource.RESOURCE_TYPE;
    }
    get default() {
        return this.srcMap.default;
    }
    get pressed() {
        return this.srcMap.pressed;
    }
    get selected() {
        return this.srcMap.selected;
    }
    get disabled() {
        return this.srcMap.disabled;
    }
}

class StyleResource extends BaseResource {

    static RESOURCE_TYPE = 'style'

    constructor(...args: []) {
        super(...args);
        this.contentType = StyleResource.RESOURCE_TYPE;
    }
}

class SVGResource extends BaseResource {

    static RESOURCE_TYPE = 'svg'

    constructor(...args: []) {
        super(...args);
        this.contentType = SVGResource.RESOURCE_TYPE;
    }
}
class ColorResource extends BaseResource {

    static RESOURCE_TYPE = 'color'

    constructor(...args: []) {
        super(...args);
        this.contentType = ColorResource.RESOURCE_TYPE;
    }
}

class ResourceManager {
    static SRC_MAP: any = {}
    static registerSrc(source: {RESOURCE_TYPE: string}) {
        this.SRC_MAP[source.RESOURCE_TYPE] = source;
        return this;
    }
    static getSrc(srcName: string) {
        return this.SRC_MAP[srcName];
    }
}
ResourceManager
    .registerSrc(ImageResource)
    .registerSrc(ColorResource)
    .registerSrc(StyleResource)
    .registerSrc(SVGResource);

export {
    ResourceManager
};
