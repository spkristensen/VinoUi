import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations:
    [
      LayoutComponent,
      // HeaderComponent,
      // FooterComponent
  ],
  exports: [LayoutComponent]
})
export class UiModule { }
