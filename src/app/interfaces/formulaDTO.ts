export interface FormulaMedicationDTO {
    name: string;
    quantity: number;
    dosage: string;
}

export interface FormulaDetailsBulkRequestDTO {
    formulaId: string;
    medications: FormulaMedicationDTO[];
}

export interface FormulaResponseDTO {
    idPrescription: string;
    doctorCedula: string;
    patientCedula: string;
    date: string;
    diagnostic: string;
    items: FormulaMedicationDTO[];
}