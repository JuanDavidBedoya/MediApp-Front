import { Component, OnInit, resource, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { FormulaService } from '../../services/formula-service';
import { AuthService } from '../../services/auth';
import { FormulaMedicationDTO } from '../../interfaces/formulaDTO';
import { MedicationDTO } from '../../interfaces/medicationDTO';

@Component({
    selector: 'app-formula-new',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './formula-new.html'
})
export class FormulaNew implements OnInit {
    private formulaService = inject(FormulaService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    doctorCedula: string | null = null;
    patientCedula: string | null = null;
    appointmentId: string | null = null;
    formulaId: string | null = null;

    diagnostic: string = '';

    medications: FormulaMedicationDTO[] = [
        { name: '', quantity: 1, dosage: '' },
    ];

    selectedMedications: { id: string; name: string }[] = [];

    medicationsResource = resource({
        loader: () => (this.formulaService.getMedications().toPromise() as Promise<MedicationDTO[]>),
        defaultValue: [] as MedicationDTO[]
    });

    isSubmitting = false;
    submissionMessage: { type: 'success' | 'error'; text: string } | null = null;
    isLoadingInitial = true;

    ngOnInit(): void {
        const doctor = this.authService.getUser();

        if (doctor && doctor.cedula && this.authService.isDoctor()) {
            this.doctorCedula = doctor.cedula;
        } else {
            this.submissionMessage = { type: 'error', text: 'Acceso denegado. Solo doctores pueden crear prescripciones.' };
            this.isLoadingInitial = false;
            return;
        }

        this.route.queryParams.subscribe(params => {
            this.patientCedula = params['patientCedula'] || null;
            this.appointmentId = params['appointmentId'] || null;
            this.formulaId = params['formulaId'] || null;

            if (!this.patientCedula || !this.appointmentId || !this.formulaId) {
                this.submissionMessage = { type: 'error', text: 'Faltan datos de paciente, cita o fórmula. No se puede crear la prescripción.' };
                this.isLoadingInitial = false;
                return;
            }

            this.isLoadingInitial = false;
        });
    }

    agregarMedicamento(): void {
        this.medications.push({ name: '', quantity: 1, dosage: '' });
    }

    eliminarMedicamento(index: number): void {
        if (this.medications.length > 1) {
            this.medications.splice(index, 1);
            this.selectedMedications.splice(index, 1);
        }
    }

    isMedicationSelected(medicationName: string, currentIndex: number): boolean {
        return this.selectedMedications.some((item, index) =>
            index !== currentIndex && item.name === medicationName
        );
    }

    onMedicationChange(event: Event, index: number): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedName = selectElement.value;
        const selectedMed = this.medicationsResource.value()?.find(med => med.name === selectedName);
        if (selectedMed) {
            this.medications[index].name = selectedMed.name;
            this.selectedMedications[index] = { id: selectedMed.id, name: selectedMed.name };
        }
    }

    async createFormula(): Promise<void> {
        if (this.isSubmitting || !this.doctorCedula || !this.patientCedula || !this.appointmentId || !this.formulaId) return;

        const validMedications = this.medications.filter(
            med => med.name && med.name.trim() !== '' &&
                   med.quantity > 0 && med.dosage && med.dosage.trim() !== ''
        );

        if (validMedications.length === 0) {
            this.submissionMessage = { type: 'error', text: 'Debes ingresar al menos un medicamento válido.' };
            return;
        }

        this.isSubmitting = true;
        this.submissionMessage = null;

        // Preparar el payload bulk según el formato requerido
        const bulkPayload = {
            formulaId: this.formulaId,
            medications: validMedications
        };

        try {
            await this.formulaService.createFormulaDetailsBulk(bulkPayload).toPromise();
            this.submissionMessage = {
                type: 'success',
                text: `¡Prescripción médica creada con éxito! Se agregaron ${validMedications.length} medicamentos.`,
            };
            setTimeout(() => this.router.navigate(['/appointments-doctor']), 3000);
        } catch (error: any) {
            console.error('Error creando detalles de fórmula:', error);
            this.submissionMessage = {
                type: 'error',
                text: `Error al crear la prescripción: ${error.error?.message || 'Error desconocido'}`
            };
        } finally {
            this.isSubmitting = false;
        }
    }
}