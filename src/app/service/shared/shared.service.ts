// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private capturaScreenSubject = new Subject<void>();

  captureScreen(argumento: any): void {
    console.log('argumento', argumento);
    this.capturaScreenSubject.next(argumento);
  }

  getCapturaScreenObservable() {
    console.log('getCapturaScreenObservable');
    return this.capturaScreenSubject.asObservable();
  }
}
