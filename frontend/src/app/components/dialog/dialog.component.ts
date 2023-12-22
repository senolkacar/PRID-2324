import {Component} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuizService } from 'src/app/services/quiz.service';
import { Quiz } from 'src/app/models/quiz';
import { MatButtonModule } from '@angular/material/button';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatButtonModule]
})
export class DialogComponent {
    constructor(public dialogRef: MatDialogRef<DialogComponent>) { }

  cancel(): void {
    // Close the dialog with 'Non' result
    this.dialogRef.close(false);
  }

  closeQuiz(): void {
    // Close the dialog with 'Oui' result
    this.dialogRef.close(true);
  }
}
