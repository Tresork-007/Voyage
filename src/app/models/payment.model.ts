import { Reservation } from '../models/reservation.model';

export interface Payment {
  id?: number;
  reservation: Reservation;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED'| string;
}

