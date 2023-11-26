import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent {
    @ViewChild('editor') editor!: CodeEditorComponent;

    query = "SELECT *\nFROM P\nWHERE COLOR='Red'";

    constructor() {}

    ngAfterViewInit(): void {
        this.editor.focus();
    }
}