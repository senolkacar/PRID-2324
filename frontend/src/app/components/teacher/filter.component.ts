import { Component,Output,EventEmitter } from '@angular/core';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
  })
export class FilterComponent{
    @Output() filterChangedEvent = new EventEmitter<string>();
    filter: string = '';
    
    filterChanged(value: string) {
       this.filterChangedEvent.emit(this.filter);
    }
}