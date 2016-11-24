import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizableComponent } from './src/resizable.component.ts';
import { DragDirective } from './src/drag.directive.ts';

export * from './src/resizable.component.ts';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    exports: [
        ResizableComponent
    ],
    declarations: [ ResizableComponent, DragDirective ]
})
export class ResizableModule {}


