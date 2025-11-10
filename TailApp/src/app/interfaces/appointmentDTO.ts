export interface AppointmentResponseDTO {
  idAppointment: string;
  doctorCedula: string;
  patientCedula: string;
  date: string;
  time: string;
  observations: string;
}

export interface AppointmentRequestDTO {
  doctorCedula: string;
  patientCedula: string;
  date: string;
  time: string;
  observations: string;
}