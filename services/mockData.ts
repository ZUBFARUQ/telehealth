import { Doctor, Specialty, Appointment, User, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Morgan',
    role: UserRole.PATIENT,
    avatar: 'https://picsum.photos/100/100?random=99',
    details: 'Patient ID: #8832'
  },
  {
    id: 'd1', // Matches Dr. Sarah Chen's ID
    name: 'Dr. Sarah Chen',
    role: UserRole.DOCTOR,
    avatar: 'https://picsum.photos/200/200?random=1',
    details: 'Cardiologist'
  },
  {
    id: 'a1',
    name: 'System Admin',
    role: UserRole.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff',
    details: 'Super Admin'
  },
  {
    id: 'f1',
    name: 'Facility Mgr.',
    role: UserRole.FACILITY_MANAGER,
    avatar: 'https://ui-avatars.com/api/?name=Facility+Manager&background=E67E22&color=fff',
    details: 'General Hospital'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Chen',
    specialty: Specialty.CARDIOLOGIST,
    rating: 4.9,
    reviews: 124,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    available: true,
    price: 150,
    bio: 'Board-certified cardiologist with 15 years of experience in preventative care and heart health.'
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    specialty: Specialty.GENERAL_PRACTITIONER,
    rating: 4.7,
    reviews: 89,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    available: true,
    price: 80,
    bio: 'Dedicated family physician focused on holistic medicine and long-term patient wellness.'
  },
  {
    id: 'd3',
    name: 'Dr. Emily Rodriguez',
    specialty: Specialty.DERMATOLOGIST,
    rating: 4.8,
    reviews: 210,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    available: false,
    price: 120,
    bio: 'Specialist in clinical and cosmetic dermatology, helping patients achieve healthy, radiant skin.'
  },
  {
    id: 'd4',
    name: 'Dr. Michael Chang',
    specialty: Specialty.PEDIATRICIAN,
    rating: 4.9,
    reviews: 156,
    imageUrl: 'https://picsum.photos/200/200?random=4',
    available: true,
    price: 100,
    bio: 'Compassionate pediatrician who loves working with children and supporting families through development.'
  },
  {
    id: 'd5',
    name: 'Dr. Lisa Patel',
    specialty: Specialty.PSYCHIATRIST,
    rating: 5.0,
    reviews: 95,
    imageUrl: 'https://picsum.photos/200/200?random=5',
    available: true,
    price: 180,
    bio: 'Experienced psychiatrist specializing in anxiety, depression, and cognitive behavioral therapy.'
  },
   {
    id: 'd6',
    name: 'Dr. Robert Stone',
    specialty: Specialty.ORTHOPEDIC,
    rating: 4.6,
    reviews: 78,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    available: true,
    price: 200,
    bio: 'Expert in sports medicine and joint replacement surgeries.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd2',
    doctorName: 'Dr. James Wilson',
    doctorImage: 'https://picsum.photos/200/200?random=2',
    specialty: Specialty.GENERAL_PRACTITIONER,
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: 'upcoming'
  },
  {
    id: 'a2',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Chen',
    doctorImage: 'https://picsum.photos/200/200?random=1',
    specialty: Specialty.CARDIOLOGIST,
    date: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
    status: 'completed',
    notes: 'Blood pressure normal. Follow up in 6 months.'
  }
];