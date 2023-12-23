import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class QuizStateService {
    private readonlyMode: boolean = false;

    setReadOnlyMode(readonly: boolean): void {
      this.readonlyMode = readonly;
    }
  
    isReadOnlyMode(): boolean {
      return this.readonlyMode;
    }
}