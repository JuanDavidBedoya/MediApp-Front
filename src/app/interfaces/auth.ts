import { DoctorResponseDTO } from "./doctorDTO";
import { UserResponseDTO } from "./userDTO";

export interface Auth {
  token: string;
  user: UserResponseDTO;
}

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO | DoctorResponseDTO; 
  role: "USER" | "DOCTOR" | string; 
}
