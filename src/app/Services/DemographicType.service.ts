import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CreateUpdateDemographicTypeDto } from '../Dtos/CreateUpdateDemographicTypeDto';
import { DemographicTypeDto } from '../Dtos/DemographicTypeDto';
import { Observable } from 'rxjs';
import { CreateUpdateDto } from '../Dtos/CreateUpdateDto';
import { CreateUpdateDetailsDto } from '../Dtos/CreateUpdateDetailsDto';
import { DemographicTypeDTLDto } from '../Dtos/DemographicTypeDTLDto';

@Injectable({
  providedIn: 'root',
})
export class DemographicTypeService {
  private DemographicTypeUrl: string;
  private DemographicTypeDTLUrl:string;
  constructor(private http: HttpClient) {
    this.DemographicTypeUrl = `https://localhost:44372/api/DemographicType/`;
    this.DemographicTypeDTLUrl = `https://localhost:44372/api/DemographicTypeDTL/`;
  }

  Create(input: CreateUpdateDemographicTypeDto): Observable<DemographicTypeDto> {
    return this.http.post<DemographicTypeDto>(
      this.DemographicTypeUrl + 'AddNewDemographicType', input);
  }


  CreateUpdate(input: CreateUpdateDto): Observable<DemographicTypeDto> {
    return this.http.post<DemographicTypeDto>(
      this.DemographicTypeUrl + 'AddAndUpdateList', input);
  }


  CreateUpdateDetails(input: CreateUpdateDetailsDto): Observable<CreateUpdateDetailsDto> {
    return this.http.post<CreateUpdateDetailsDto>(
      this.DemographicTypeDTLUrl + 'AddAndUpdateList', input);
  }

  Update(input: CreateUpdateDemographicTypeDto): Observable<DemographicTypeDto> {
    return this.http.put<DemographicTypeDto>(
      this.DemographicTypeUrl + 'EditDemographicType', input);
  }

  Delete(id: number): Observable<DemographicTypeDto> {
    return this.http.delete<DemographicTypeDto>(
      this.DemographicTypeUrl + `DeleteDemographicType/${id}`);
  }

  GetById(id: number): Observable<DemographicTypeDto> {
    return this.http.get<DemographicTypeDto>(
      this.DemographicTypeUrl + `GetDemographicTypeData/${id}`);
  }

  GetAll(): Observable<DemographicTypeDto[]> {
    return this.http.get<DemographicTypeDto[]>(
      this.DemographicTypeUrl + 'GetAllDemographicTypes');
  }
}
