import { isPlatformServer } from '@angular/common';
import { Component, Directive, ElementRef, EventEmitter, forwardRef, inject, Input, NgZone, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Slick component
 */
export class SlickCarouselComponent {
    config;
    afterChange = new EventEmitter();
    beforeChange = new EventEmitter();
    breakpoint = new EventEmitter();
    destroy = new EventEmitter();
    init = new EventEmitter();
    $instance;
    // access from parent component can be a problem with change detection timing. Please use afterChange output
    currentIndex = 0;
    slides = [];
    initialized = false;
    _removedSlides = [];
    _addedSlides = [];
    el = inject(ElementRef);
    zone = inject(NgZone);
    isServer = isPlatformServer(inject(PLATFORM_ID));
    /**
     * On component destroy
     */
    ngOnDestroy() {
        this.unslick();
    }
    ngAfterViewInit() {
        this.ngAfterViewChecked();
    }
    /**
     * On component view checked
     */
    ngAfterViewChecked() {
        if (this.isServer) {
            return;
        }
        if (this._addedSlides.length > 0 || this._removedSlides.length > 0) {
            const nextSlidesLength = this.slides.length - this._removedSlides.length + this._addedSlides.length;
            if (!this.initialized) {
                if (nextSlidesLength > 0) {
                    this.initSlick();
                }
                // if nextSlidesLength is zere, do nothing
            }
            else if (nextSlidesLength === 0) { // unslick case
                this.unslick();
            }
            else {
                this._addedSlides.forEach(slickItem => {
                    this.slides.push(slickItem);
                    this.zone.runOutsideAngular(() => {
                        this.$instance.slick('slickAdd', slickItem.el.nativeElement);
                    });
                });
                this._addedSlides = [];
                this._removedSlides.forEach(slickItem => {
                    const idx = this.slides.indexOf(slickItem);
                    this.slides = this.slides.filter(s => s !== slickItem);
                    this.zone.runOutsideAngular(() => {
                        this.$instance.slick('slickRemove', idx);
                    });
                });
                this._removedSlides = [];
            }
        }
    }
    /**
     * init slick
     */
    initSlick() {
        this.slides = this._addedSlides;
        this._addedSlides = [];
        this._removedSlides = [];
        this.zone.runOutsideAngular(() => {
            this.$instance = jQuery(this.el.nativeElement);
            this.$instance.on('init', (event, slick) => {
                this.zone.run(() => {
                    this.init.emit({ event, slick });
                });
            });
            this.$instance.slick(this.config);
            this.zone.run(() => {
                this.initialized = true;
                this.currentIndex = this.config?.initialSlide || 0;
            });
            this.$instance.on('afterChange', (event, slick, currentSlide) => {
                this.zone.run(() => {
                    this.afterChange.emit({
                        event,
                        slick,
                        currentSlide,
                        first: currentSlide === 0,
                        last: slick.$slides.length === currentSlide + slick.options.slidesToScroll
                    });
                    this.currentIndex = currentSlide;
                });
            });
            this.$instance.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
                this.zone.run(() => {
                    this.beforeChange.emit({ event, slick, currentSlide, nextSlide });
                    this.currentIndex = nextSlide;
                });
            });
            this.$instance.on('breakpoint', (event, slick, breakpoint) => {
                this.zone.run(() => {
                    this.breakpoint.emit({ event, slick, breakpoint });
                });
            });
            this.$instance.on('destroy', (event, slick) => {
                this.zone.run(() => {
                    this.destroy.emit({ event, slick });
                    this.initialized = false;
                });
            });
        });
    }
    addSlide(slickItem) {
        this._addedSlides.push(slickItem);
    }
    removeSlide(slickItem) {
        this._removedSlides.push(slickItem);
    }
    /**
     * Slick Method
     */
    slickGoTo(index) {
        this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickGoTo', index);
        });
    }
    slickNext() {
        this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickNext');
        });
    }
    slickPrev() {
        this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickPrev');
        });
    }
    slickPause() {
        this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickPause');
        });
    }
    slickPlay() {
        this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickPlay');
        });
    }
    unslick() {
        if (this.$instance) {
            this.zone.runOutsideAngular(() => {
                this.$instance.slick('unslick');
            });
            this.$instance = undefined;
        }
        this.initialized = false;
    }
    ngOnChanges(changes) {
        if (this.initialized) {
            const config = changes['config'];
            if (config.previousValue !== config.currentValue && config.currentValue !== undefined) {
                const refresh = config.currentValue['refresh'];
                const newOptions = Object.assign({}, config.currentValue);
                delete newOptions['refresh'];
                this.zone.runOutsideAngular(() => {
                    this.$instance.slick('slickSetOption', newOptions, refresh);
                });
            }
        }
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: SlickCarouselComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: SlickCarouselComponent, selector: "ngx-slick-carousel", inputs: { config: "config" }, outputs: { afterChange: "afterChange", beforeChange: "beforeChange", breakpoint: "breakpoint", destroy: "destroy", init: "init" }, providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef((() => SlickCarouselComponent)),
                multi: true
            }], exportAs: ["slick-carousel"], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: SlickCarouselComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-slick-carousel',
                    exportAs: 'slick-carousel',
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => SlickCarouselComponent)),
                            multi: true
                        }],
                    template: '<ng-content></ng-content>',
                }]
        }], propDecorators: { config: [{
                type: Input
            }], afterChange: [{
                type: Output
            }], beforeChange: [{
                type: Output
            }], breakpoint: [{
                type: Output
            }], destroy: [{
                type: Output
            }], init: [{
                type: Output
            }] } });
export class SlickItemDirective {
    carousel = inject(SlickCarouselComponent, { host: true });
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    isServer = isPlatformServer(inject(PLATFORM_ID));
    ngOnInit() {
        this.carousel.addSlide(this);
        if (this.isServer && this.carousel.slides.length > 0) {
            // Do not show other slides in server side rendering (broken ui can be affacted to Core Web Vitals)
            this.renderer.setStyle(this.el, 'display', 'none');
        }
    }
    ngOnDestroy() {
        this.carousel.removeSlide(this);
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: SlickItemDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0", type: SlickItemDirective, selector: "[ngxSlickItem]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: SlickItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxSlickItem]',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NsaWNrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBR0wsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFJbkQ7O0dBRUc7QUFXSCxNQUFNLE9BQU8sc0JBQXNCO0lBRXRCLE1BQU0sQ0FBTTtJQUNYLFdBQVcsR0FBa0csSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUNoSSxZQUFZLEdBQXNGLElBQUksWUFBWSxFQUFFLENBQUM7SUFDckgsVUFBVSxHQUE4RCxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQzNGLE9BQU8sR0FBNkMsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUN2RSxJQUFJLEdBQTZDLElBQUksWUFBWSxFQUFFLENBQUM7SUFFekUsU0FBUyxDQUFNO0lBRXRCLDRHQUE0RztJQUNwRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRWxCLE1BQU0sR0FBVSxFQUFFLENBQUM7SUFDbkIsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNuQixjQUFjLEdBQXlCLEVBQUUsQ0FBQztJQUMxQyxZQUFZLEdBQXlCLEVBQUUsQ0FBQztJQUV4QyxFQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEIsUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRXpEOztPQUVH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ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5kZWNsYXJlIGNvbnN0IGpRdWVyeTogYW55O1xuXG4vKipcbiAqIFNsaWNrIGNvbXBvbmVudFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtc2xpY2stY2Fyb3VzZWwnLFxuICBleHBvcnRBczogJ3NsaWNrLWNhcm91c2VsJyxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWNrQ2Fyb3VzZWxDb21wb25lbnQpLFxuICAgIG11bHRpOiB0cnVlXG4gIH1dLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxufSlcbmV4cG9ydCBjbGFzcyBTbGlja0Nhcm91c2VsQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQge1xuXG4gICAgQElucHV0KCkgY29uZmlnOiBhbnk7XG4gICAgQE91dHB1dCgpIGFmdGVyQ2hhbmdlOiBFdmVudEVtaXR0ZXI8eyBldmVudDogYW55LCBzbGljazogYW55LCBjdXJyZW50U2xpZGU6IG51bWJlciwgZmlyc3Q6IGJvb2xlYW4sIGxhc3Q6IGJvb2xlYW4gfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIGJlZm9yZUNoYW5nZTogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IGFueSwgc2xpY2s6IGFueSwgY3VycmVudFNsaWRlOiBudW1iZXIsIG5leHRTbGlkZTogbnVtYmVyIH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoKSBicmVha3BvaW50OiBFdmVudEVtaXR0ZXI8eyBldmVudDogYW55LCBzbGljazogYW55LCBicmVha3BvaW50OiBhbnkgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIGRlc3Ryb3k6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBhbnksIHNsaWNrOiBhbnkgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIGluaXQ6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBhbnksIHNsaWNrOiBhbnkgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljICRpbnN0YW5jZTogYW55O1xuXG4gIC8vIGFjY2VzcyBmcm9tIHBhcmVudCBjb21wb25lbnQgY2FuIGJlIGEgcHJvYmxlbSB3aXRoIGNoYW5nZSBkZXRlY3Rpb24gdGltaW5nLiBQbGVhc2UgdXNlIGFmdGVyQ2hhbmdlIG91dHB1dFxuICBwcml2YXRlIGN1cnJlbnRJbmRleCA9IDA7XG5cbiAgcHVibGljIHNsaWRlczogYW55W10gPSBbXTtcbiAgcHVibGljIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3JlbW92ZWRTbGlkZXM6IFNsaWNrSXRlbURpcmVjdGl2ZVtdID0gW107XG4gIHByaXZhdGUgX2FkZGVkU2xpZGVzOiBTbGlja0l0ZW1EaXJlY3RpdmVbXSA9IFtdO1xuXG4gIHByaXZhdGUgZWwgPSBpbmplY3QoRWxlbWVudFJlZik7XG4gIHByaXZhdGUgem9uZSA9IGluamVjdChOZ1pvbmUpO1xuICBwcml2YXRlIGlzU2VydmVyID0gaXNQbGF0Zm9ybVNlcnZlcihpbmplY3QoUExBVEZPUk1fSUQpKTtcblxuICAvKipcbiAgICogT24gY29tcG9uZW50IGRlc3Ryb3lcbiAgICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudW5zbGljaygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubmdBZnRlclZpZXdDaGVja2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogT24gY29tcG9uZW50IHZpZXcgY2hlY2tlZFxuICAgKi9cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9hZGRlZFNsaWRlcy5sZW5ndGggPiAwIHx8IHRoaXMuX3JlbW92ZWRTbGlkZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbmV4dFNsaWRlc0xlbmd0aCA9IHRoaXMuc2xpZGVzLmxlbmd0aCAtIHRoaXMuX3JlbW92ZWRTbGlkZXMubGVuZ3RoICsgdGhpcy5fYWRkZWRTbGlkZXMubGVuZ3RoO1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIGlmIChuZXh0U2xpZGVzTGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuaW5pdFNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgbmV4dFNsaWRlc0xlbmd0aCBpcyB6ZXJlLCBkbyBub3RoaW5nXG4gICAgICB9IGVsc2UgaWYgKG5leHRTbGlkZXNMZW5ndGggPT09IDApIHsgLy8gdW5zbGljayBjYXNlXG4gICAgICAgIHRoaXMudW5zbGljaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWRkZWRTbGlkZXMuZm9yRWFjaChzbGlja0l0ZW0gPT4ge1xuICAgICAgICAgIHRoaXMuc2xpZGVzLnB1c2goc2xpY2tJdGVtKTtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kaW5zdGFuY2Uuc2xpY2soJ3NsaWNrQWRkJywgc2xpY2tJdGVtLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYWRkZWRTbGlkZXMgPSBbXTtcblxuICAgICAgICB0aGlzLl9yZW1vdmVkU2xpZGVzLmZvckVhY2goc2xpY2tJdGVtID0+IHtcbiAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLnNsaWRlcy5pbmRleE9mKHNsaWNrSXRlbSk7XG4gICAgICAgICAgdGhpcy5zbGlkZXMgPSB0aGlzLnNsaWRlcy5maWx0ZXIocyA9PiBzICE9PSBzbGlja0l0ZW0pO1xuICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiRpbnN0YW5jZS5zbGljaygnc2xpY2tSZW1vdmUnLCBpZHgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZFNsaWRlcyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0IHNsaWNrXG4gICAqL1xuICBpbml0U2xpY2soKSB7XG4gICAgdGhpcy5zbGlkZXMgPSB0aGlzLl9hZGRlZFNsaWRlcztcbiAgICB0aGlzLl9hZGRlZFNsaWRlcyA9IFtdO1xuICAgIHRoaXMuX3JlbW92ZWRTbGlkZXMgPSBbXTtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy4kaW5zdGFuY2UgPSBqUXVlcnkodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgdGhpcy4kaW5zdGFuY2Uub24oJ2luaXQnLCAoZXZlbnQsIHNsaWNrKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5pdC5lbWl0KHsgZXZlbnQsIHNsaWNrIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRpbnN0YW5jZS5zbGljayh0aGlzLmNvbmZpZyk7XG5cbiAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuY29uZmlnPy5pbml0aWFsU2xpZGUgfHwgMDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRpbnN0YW5jZS5vbignYWZ0ZXJDaGFuZ2UnLCAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFmdGVyQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgIHNsaWNrLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZSxcbiAgICAgICAgICAgICAgICBmaXJzdDogY3VycmVudFNsaWRlID09PSAwLFxuICAgICAgICAgICAgICAgIGxhc3Q6IHNsaWNrLiRzbGlkZXMubGVuZ3RoID09PSBjdXJyZW50U2xpZGUgKyBzbGljay5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gY3VycmVudFNsaWRlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRpbnN0YW5jZS5vbignYmVmb3JlQ2hhbmdlJywgKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5iZWZvcmVDaGFuZ2UuZW1pdCh7IGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUgfSk7XG4gICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBuZXh0U2xpZGU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJGluc3RhbmNlLm9uKCdicmVha3BvaW50JywgKGV2ZW50LCBzbGljaywgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmJyZWFrcG9pbnQuZW1pdCh7IGV2ZW50LCBzbGljaywgYnJlYWtwb2ludCB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy4kaW5zdGFuY2Uub24oJ2Rlc3Ryb3knLCAoZXZlbnQsIHNsaWNrKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVzdHJveS5lbWl0KHsgZXZlbnQsIHNsaWNrIH0pO1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZFNsaWRlKHNsaWNrSXRlbTogU2xpY2tJdGVtRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5fYWRkZWRTbGlkZXMucHVzaChzbGlja0l0ZW0pO1xuICB9XG5cbiAgcmVtb3ZlU2xpZGUoc2xpY2tJdGVtOiBTbGlja0l0ZW1EaXJlY3RpdmUpIHtcbiAgICB0aGlzLl9yZW1vdmVkU2xpZGVzLnB1c2goc2xpY2tJdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTbGljayBNZXRob2RcbiAgICovXG4gIHB1YmxpYyBzbGlja0dvVG8oaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLiRpbnN0YW5jZS5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNsaWNrTmV4dCgpIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy4kaW5zdGFuY2Uuc2xpY2soJ3NsaWNrTmV4dCcpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNsaWNrUHJldigpIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy4kaW5zdGFuY2Uuc2xpY2soJ3NsaWNrUHJldicpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNsaWNrUGF1c2UoKSB7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuJGluc3RhbmNlLnNsaWNrKCdzbGlja1BhdXNlJyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2xpY2tQbGF5KCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLiRpbnN0YW5jZS5zbGljaygnc2xpY2tQbGF5Jyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5zbGljaygpIHtcbiAgICBpZiAodGhpcy4kaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuJGluc3RhbmNlLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuJGluc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNoYW5nZXNbJ2NvbmZpZyddO1xuICAgICAgaWYgKGNvbmZpZy5wcmV2aW91c1ZhbHVlICE9PSBjb25maWcuY3VycmVudFZhbHVlICYmIGNvbmZpZy5jdXJyZW50VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCByZWZyZXNoID0gY29uZmlnLmN1cnJlbnRWYWx1ZVsncmVmcmVzaCddO1xuICAgICAgICBjb25zdCBuZXdPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIGRlbGV0ZSBuZXdPcHRpb25zWydyZWZyZXNoJ107XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB0aGlzLiRpbnN0YW5jZS5zbGljaygnc2xpY2tTZXRPcHRpb24nLCBuZXdPcHRpb25zLCByZWZyZXNoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25neFNsaWNrSXRlbV0nLFxufSlcbmV4cG9ydCBjbGFzcyBTbGlja0l0ZW1EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgY2Fyb3VzZWwgPSBpbmplY3QoU2xpY2tDYXJvdXNlbENvbXBvbmVudCwgeyBob3N0OiB0cnVlIH0pO1xuXG4gIHJlbmRlcmVyID0gaW5qZWN0KFJlbmRlcmVyMik7XG4gIGVsID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuICBpc1NlcnZlciA9IGlzUGxhdGZvcm1TZXJ2ZXIoaW5qZWN0KFBMQVRGT1JNX0lEKSk7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jYXJvdXNlbC5hZGRTbGlkZSh0aGlzKTtcbiAgICBpZiAodGhpcy5pc1NlcnZlciAmJiB0aGlzLmNhcm91c2VsLnNsaWRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBEbyBub3Qgc2hvdyBvdGhlciBzbGlkZXMgaW4gc2VydmVyIHNpZGUgcmVuZGVyaW5nIChicm9rZW4gdWkgY2FuIGJlIGFmZmFjdGVkIHRvIENvcmUgV2ViIFZpdGFscylcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2Fyb3VzZWwucmVtb3ZlU2xpZGUodGhpcyk7XG4gIH1cbn1cbiJdfQ==