import { User } from './user.model';
import { Destination } from './destination.model';

export interface Reservation {
  id?: number;
  user: User;
  destination: Destination;
  reservationDate: Date;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

