export default class Modal {

    static CACHE: {
        [key: string]: any;
    } = {};

    static TOGGLE_BTN = '[d-modal-toogle]'

    static create(...args: [HTMLElement|string|null, any?]) {
        return new this(...args);
    }
    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.TOGGLE_BTN).forEach((root: any) => {
                this.create(root);
            });
        }).bind(this));
    }
    public toggleBtn?: HTMLElement|null;
    public options: any;

    constructor(root: HTMLElement|string|null, options?: any) {
        if (root) {
            this.toggleBtn = typeof root === 'string' ? document.querySelector(root) : root;
            this.toggleBtn?.addEventListener('click', this.toggleModal.bind(this));
        }

        this.options = options;

        this.init()
            .mount();
    }

    public root?: HTMLElement;

    init() {
        this.makeRootElement();
        this.root?.addEventListener('click', ((event: {target: any}) => {
            const eventList = [
                {
                    cls: '.btn-close',
                    event: this.hide
                },
                {
                    cls: '.btn-ok',
                    event: this.ok
                },
                {
                    cls: '.btn-cancel',
                    event: this.cancel
                }
            ];
            for (const btnEvent of eventList) {
                const elem = event.target.closest(btnEvent.cls);
                if (elem) {
                    btnEvent.event.call(this, elem);
                }
            }
        }).bind(this));
        return this;
    }
    ok(_?: any) {
        this.options?.actions?.ok?.(this.root);
        this.hide();
    }
    cancel(_?: any) {
        this.options.cancel?.() ?? this.hide();
    }

    makeRootElement() {
        const div = document.createElement('div');
        div.setAttribute('role', 'd-modal');
        this.root = div;
    }

    getScrollbacWidth() {
        return Math.abs(document.documentElement.offsetWidth - window.innerWidth);
    }

    setBodyStyle() {
        const scrollbarWidth = this.getScrollbacWidth();
        Modal.CACHE['body-style'] = document.body.getAttribute('style');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return this;
    }

    resetBodyStyle() {
        (document.body as any).style = Modal.CACHE['body-style'];
        return this;
    }

    show(cb = (_?: any, s?: any) => {}) {
        this.root?.classList.add('show');
        document.querySelector('.modal-backdrop')?.classList.add('show');

        this.setBodyStyle();
        typeof cb === 'function' && cb(this.root, this.options);
        return this;
    }

    hide(cb = (_?: Element) => {}) {
        this.root?.classList.remove('show');
        document.querySelector('.modal-backdrop')?.classList.remove('show');

        this.resetBodyStyle();
        typeof cb === 'function' && cb(this.root);
        return this;
    }

    toggleModal() {
        this.root?.classList.toggle('show');
        document.querySelector('.modal-backdrop')?.classList.toggle('show');
    }
    
    mount() {
        document.body.appendChild(this.render());
        this.options.actions?.init?.(this.root);
        if (!document.querySelector('.modal-backdrop')) {
            document.body.appendChild(this.createBackdrop());
        }
        return this;
    }

    createBackdrop() {
        const div = document.createElement('div');
        div.classList.add('modal-backdrop');
        return div;
    }

    public data: any;

    render(): any {
        (this.root as any).innerHTML = this.template(this.data);
        return this.root;
    }

    template(_?: object) {
        const {title, slots = {}} = this.options;
        const {body} = slots;
        return `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title">${title}</div>
                        <div class="btn-close"></div>
                    </div>
                    <div class="modal-body">${typeof body === 'function' ? body(this.root) : (body ?? '')}</div>
                    <div class="modal-footer">
                        <div class="btn btn-ok btn-primary">确定</div>
                        <div class="btn btn-cancel">取消</div>
                    </div>
                </div>
            </div>
        `;
    }
}