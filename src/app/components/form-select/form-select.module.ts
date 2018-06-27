import {NgModule} from '@angular/core';
import {FormSelectComponent} from './form-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule,
        NgbTypeaheadModule],
    exports: [FormSelectComponent],
    declarations: [FormSelectComponent],
})

export class FormSelectModule {
}
