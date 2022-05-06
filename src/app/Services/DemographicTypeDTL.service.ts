import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DemographicTypeDTLDto } from '../Dtos/DemographicTypeDTLDto';

@Injectable({
  providedIn: 'root'
})
export class DemographicTypeDTLService {

  private DemographicTypeDTLUrl: string;
  constructor(private http: HttpClient) {
    this.DemographicTypeDTLUrl = `https://localhost:44372/api/DemographicTypeDTL/`;
  }
Delete(id: number): Observable<DemographicTypeDTLDto> {
  return this.http.delete<DemographicTypeDTLDto>(
    this.DemographicTypeDTLUrl + `DeleteDemographicTypeDTL/${id}`);
}
}
