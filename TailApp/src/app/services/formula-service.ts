import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { FormulaResponseDTO } from '../interfaces/formulaDTO';
import { MedicationDTO } from '../interfaces/medicationDTO';

@Injectable({
    providedIn: 'root',
})
export class FormulaService {
    private apiUrl = `${environment.apiUrl}`;
    private formulaApiUrl = `${this.apiUrl}/formulas`;
    private medicationsApiUrl = `${this.apiUrl}/medications`;

    constructor(private http: HttpClient) { }

    getMedications(): Observable<MedicationDTO[]> {
        return this.http.get<MedicationDTO[]>(this.medicationsApiUrl);
    }

    createFormula(
        request: any
    ): Observable<FormulaResponseDTO> {
        return this.http.post<FormulaResponseDTO>(
            this.formulaApiUrl,
            request
        );
    }

    createFormulaDetail(
        detailRequest: { formulaId: string; medicationId: string; quantity: number; dosage: string }
    ): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/formula-details`,
            detailRequest
        );
    }

    createFormulaDetailsBulk(
        bulkRequest: { formulaId: string; medications: { name: string; quantity: number; dosage: string }[] }
    ): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/formula-details/bulk`,
            bulkRequest
        );
    }
}