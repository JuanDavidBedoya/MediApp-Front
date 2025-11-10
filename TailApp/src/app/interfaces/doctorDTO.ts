export interface DoctorResponseDTO {
  cedula: string;
  name: string;
  phone: string;
  email: string;
  specialityName: string;
}

export interface DoctorRequestDTO {
  cedula: string;
  name: string;
  phone: string;
  email: string;
  specialityName: string;
  password: string;
}

export interface DoctorUpdateDTO {
  name: string;
  phone: string;
  email: string;
  specialityName: string;
  password: string;
}