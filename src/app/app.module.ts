// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NGX-Color Modules
import { ColorSketchModule } from 'ngx-color/sketch';

// Local Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityControllerComponent } from './entity/entity-controller/entity-controller.component';
import { ControlLineComponent } from './shared/components/control-line/control-line.component';
import { EmitterControllerComponent } from './emitter/emitter-controller/emitter-controller.component';
import { ControllerWrapperComponent } from './shared/components/controller-wrapper/controller-wrapper.component';
import { ColorPickerComponent } from './shared/components/color-picker/color-picker.component';
import { EntityCanvasComponent } from './entity/entity-canvas/entity-canvas.component';
import { BarControllerComponent } from './entity-content/bar/bar-controller/bar-controller.component';
import { BarcleControllerComponent } from './entity-content/barcle/barcle-controller/barcle-controller.component';
import { CircleControllerComponent } from './entity-content/circle/circle-controller/circle-controller.component';
import { ImageControllerComponent } from './entity-content/image/image-controller/image-controller.component';
import { EmitterComponent } from './emitter/emitter.component';
import { DraggableDirective } from './shared/components/draggable/draggable.directive';
import { SourcePickerComponent } from './shared/components/source-picker/source-picker.component';

// NG-Zorro Base
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';

// NG-Zorro Component Modules
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

registerLocaleData(en);  // NG-Zorro

@NgModule({
    declarations: [
        AppComponent,
        EntityControllerComponent,
        ControlLineComponent,
        EmitterControllerComponent,
        ControllerWrapperComponent,
        ColorPickerComponent,
        ImageControllerComponent,
        EntityCanvasComponent,
        BarControllerComponent,
        BarcleControllerComponent,
        CircleControllerComponent,
        EmitterComponent,
        DraggableDirective,
        SourcePickerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ColorSketchModule,
        NzButtonModule,
        NzDropDownModule,
        NzIconModule,
        NzRadioModule,
        NzSliderModule,
        NzDividerModule,
        NzSwitchModule,
        NzInputNumberModule,
        NzPopoverModule,
        NzSelectModule,
        NzUploadModule,
        NzCollapseModule,
        NzInputModule,
        NzFormModule,
        NzToolTipModule,
    ],
    providers: [ { provide: NZ_I18N, useValue: en_US }, NzMessageService ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
