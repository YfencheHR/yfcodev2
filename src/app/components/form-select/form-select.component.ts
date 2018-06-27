import {Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges} from '@angular/core';
import {debounceTime, map} from 'rxjs/operators';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
@Component({
    selector: 'app-form-select',
    templateUrl: './form-select.component.html',
    styles: []
})
export class FormSelectComponent implements OnInit, OnChanges {
    @Input() public item: any;
    @Input() public index: any;
    @Input() public listData: any;

    @Output() eventUpdate: EventEmitter<any> = new EventEmitter();

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    public model: any;
    private oldModel: any;

    constructor() { }

    ngOnInit() {
       this.model = this.item;
    }

    ngOnChanges() {
        this.model = this.item;
    }

    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            map(term => term === '' ?
                []
                :
                this.listData.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        )
    formatMatches = (value: any) => value.name || '';

    onClickTypeahead(target) {
        this.click$.next(target.value);
    }

    onFocusTypeahead(target) {
        this.oldModel = this.model;
        this.model = null;
        this.focus$.next(target.value);
    }

    focusOutTypeahead(target) {
        if (this.modelCheckObject()) {
            this.oldModel = this.model;
        } else if (typeof(this.oldModel) === 'object') {
            this.model = this.oldModel;
        } else {
            this.oldModel = this.model = this.item;
        }
    }

    changeTypeahead(target) {
        if (this.modelCheckObject() === true) {
            this.oldModel = this.model;
            this.sendEmit(target);
        }
    }

    modelCheckObject() {
        return (this.model !== null && typeof (this.model) === 'object');
    }

    private sendEmit(target) {
        const result = {
            'index': this.index,
            'new': this.model
        };

        this.eventUpdate.emit(result);
    }

}
