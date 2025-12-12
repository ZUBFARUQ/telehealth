export enum Specialty {
  GENERAL_PRACTITIONER = 'General Practitioner',
  CARDIOLOGIST = 'Cardiologist',
  DERMATOLOGIST = 'Dermatologist',
  PEDIATRICIAN = 'Pediatrician',
  PSYCHIATRIST = 'Psychiatrist',
  ORTHOPEDIC = 'Orthopedic',
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  FACILITY_MANAGER = 'facility_manager'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  details?: string; // e.g., Specialty for doctors
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  rating: number;
  reviews: number;
  imageUrl: string;
  available: boolean;
  price: number;
  bio: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: Specialty;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewState = 'dashboard' | 'doctors' | 'appointments' | 'ai-triage' | 'consultation' | 'users' | 'analytics' | 'schedule' | 'resources';