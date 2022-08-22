export default class Modal {

    static CACHE = {};

    static TOGGLE_BTN = '[d-modal-toogle]'

    static create(...args) {
        return new this(...args);
    }
    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.TOGGLE_BTN).forEach(root => {
                this.create(root);
            });
        }).bind(this));
    }
    constructor(root, options) {
        if (root) {
            this.toggleBtn = typeof root === 'string' ? document.querySelector(root) : root;
            this.toggleBtn.addEventListener('click', this.toggleModal.bind(this));
        }

        this.options = options;

        this.init()
            .mount();
    }

    init() {
        this.makeRootElement();
        this.root.addEventListener('click', (event => {
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
    ok() {
        this.options?.actions?.ok?.(this.root);
        this.hide();
    }
    cancel() {
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
        document.body.style = Modal.CACHE['body-style'];
        return this;
    }

    show(cb = () => {}) {
        this.root.classList.add('show');
        document.querySelector('.modal-backdrop').classList.add('show');

        this.setBodyStyle();
        typeof cb === 'function' && cb(this.root, this.options);
        return this;
    }

    hide(cb = () => {}) {
        this.root.classList.remove('show');
        document.querySelector('.modal-backdrop').classList.remove('show');

        this.resetBodyStyle();
        typeof cb === 'function' && cb(this.root);
        return this;
    }

    toggleModal() {
        this.root.classList.toggle('show');
        document.querySelector('.modal-backdrop').classList.toggle('show');
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

    render() {
        this.root.innerHTML = this.template(this.data);
        return this.root;
    }

    template() {
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