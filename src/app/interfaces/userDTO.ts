export interface UserResponseDTO {
  cedula: string;
  name: string;
  email: string;
  epsName: string;
  phones: string[];
  cityName: string;
}

export interface UserRequestDTO {
  cedula: string;
  name: string;
  email: string;
  password: string;
  epsName: string;
  phones: string[];
  cityName: string;
}

export interface UserUpdateDTO {
  name: string;
  email: string;
  password: string;
  epsName: string;
  cityName: string;
  phones: string[];
}
