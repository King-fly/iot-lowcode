export default class CompDraggable {

    static ROOT = '[d-comp-draggable]';

    static create(...args) {
        return new this(...args);
    }

    static loader() {
        document.addEventListener('DOMContentLoaded', (() => {
            document.querySelectorAll(this.ROOT).forEach(root => {
                this.create(root);
            });
        }).bind(this))
    }

    constructor(root, options = {
        endCallback: () => {}
    }) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = options;
        this.pos = {
            start: {},
            raw: {}
        };
        this.dragStatus = false;
        this.SPACE_KEY = false;
        this.endCallback = options.endCallback;
        this.root.addEventListener('mousedown', this.mousedown.bind(this));
        this.root.addEventListener('mousemove', this.mousemove.bind(this));
        this.root.addEventListener('mouseup', this.mouseup.bind(this));
        this.root.addEventListener('mouseleave', this.mouseleave.bind(this));
        document.addEventListener('keydown', this.moveKeydown.bind(this), false);
        document.addEventListener('keyup', this.moveKeyup.bind(this), false);
    }

    mousemove(event) {
        if (this.dragStatus && !this.SPACE_KEY) {
            this.root.classList.remove('selected');
            const x = this.pos.raw.x + event.pageX - this.pos.start.x;
            const y = this.pos.raw.y + event.pageY - this.pos.start.y;
            requestAnimationFrame(() => {
                this.root.style.left = x + 'px';
                this.root.style.top = y + 'px';
                this.pos.end = {
                    x,
                    y
                };
            });
        }
    }
    mouseleave() {
        this.dragStatus = false;
        this.root.classList.add('selected');
    }
    mouseup() {
        this.endCallback(this.pos.end, this.root);
        this.dragStatus = false;
        this.root.classList.add('selected');
    }
    mousedown(event) {
        if (this.SPACE_KEY) return;
        this.root.classList.remove('selected');
        this.dragStatus = true;
        this.pos.start = {
            x: event.pageX,
            y: event.pageY,
        };
        this.pos.raw = {
            x: parseInt(getComputedStyle(this.root).left),
            y: parseInt(getComputedStyle(this.root).top)
        }

    }

    moveKeydown(event) {
        if (event.keyCode === 32) {
            this.SPACE_KEY = true;
        }
    }

    moveKeyup() {
        this.SPACE_KEY = false;
    }
}