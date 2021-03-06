import { Component, ElementRef, HostBinding, Input, Inject, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DragDirective } from './drag.directive.ts';

@Component({
    selector: 'region-compoment',
    templateUrl: 'resizable.component.html',
    styleUrls: ['resizable.component.css'],
    providers: [ { provide: Window, useValue: window } ],
    encapsulation: ViewEncapsulation.None,
    directives: [ DragDirective ]
})
export class RegionComponent {

    @HostBinding('class.resizable') true;
    @HostBinding('class.no-transition') noTransition = false;
    @HostBinding('style.width') width;
    @HostBinding('style.height') height;
    @HostBinding('style.flex-basis') flexBasis;

    @Input() directions;
    @Input() rFlex = false;

    @Output() resizeStart = new EventEmitter();
    @Output() resizing = new EventEmitter();
    @Output() resizeEnd = new EventEmitter();

    private regionElement;
    private nativeElement;

    private window;

    private style;

    private w;
    private h;

    private vx = 1;
    private vy = 1;

    private start;

    private dragDir;

    private axis;

    private info = {};

    private flexBasis;

    constructor(private regionElement: ElementRef, @Inject(Window) private window: Window) {
        this.nativeElement = this.regionElement.nativeElement;
        this.style = this.window.getComputedStyle(this.nativeElement, null);
    }

    ngOnInit() {
        this.flexBasis = 'flexBasis' in this.nativeElement.style ? 'flexBasis' :
            'webkitFlexBasis' in this.nativeElement.style ? 'webkitFlexBasis' :
            'msFlexPreferredSize' in this.nativeElement.style ? 'msFlexPreferredSize' : 'flexBasis';
    }

    private updateInfo(e) {
        this.info['width'] = false; this.info['height'] = false;
        if(this.axis === 'x') {
            this.info['width'] = parseInt(this.nativeElement.style[this.rFlex ? this.flexBasis : 'width']);
        } else {
            this.info['height'] = parseInt(this.nativeElement.style[this.rFlex ? this.flexBasis : 'height']);
        }
        this.info['id'] = this.nativeElement.id;
        this.info['evt'] = e;
    };

    private dragStart(e, direction) {
        let mouseEvent = e.originalEvent;

        this.dragDir = direction;
        this.axis = (this.dragDir === 'left' || this.dragDir === 'right') ? 'x' : 'y';
        this.start = (this.axis === 'x' ? mouseEvent.clientX : mouseEvent.clientY);
        this.w = parseInt(this.style.getPropertyValue('width'));
        this.h = parseInt(this.style.getPropertyValue('height'));

        this.resizeStart.emit({ info: this.info });

        //prevent transition while dragging
        this.noTransition = true;
    }

    private dragEnd(e) {
        let mouseEvent = e.originalEvent;

        this.updateInfo(mouseEvent);
        this.resizeEnd.emit({ info: this.info });
        this.noTransition = false;
    }

    private dragging(e) {
        let mouseEvent = e.originalEvent;
        let prop, offset = (this.axis === 'x') ? this.start - mouseEvent.clientX : this.start - mouseEvent.clientY;

        var operand = 1;
        switch(this.dragDir) {
            case 'top':
                operand = -1;
            case 'bottom':
                let height = (this.h - offset * this.vy * operand) + 'px';
                if(this.rFlex) {
                    this.flexBasis = height;
                } else {
                    this.height = height;
                }

                break;
            case 'left':
                operand = -1;
            case 'right':
                let width = (this.w - offset * this.vx * operand) + 'px';
                if(this.rFlex) {
                    this.flexBasis = width;
                } else {
                    this.width = width;
                }

                break;

        }
        this.updateInfo(mouseEvent);
        this.resizing.emit({ info: this.info });
    }
}