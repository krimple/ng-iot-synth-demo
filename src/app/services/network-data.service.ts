import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NetworkDataService {
  constructor(private httpClient: HttpClient) { }

  getSampleRawData(fileName: string): Observable<ArrayBuffer> {
    return this.httpClient.get(fileName, {
      responseType: 'arraybuffer'
    });
  }
}