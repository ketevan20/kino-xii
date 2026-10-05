export interface FilterOptions {
  venues: Venue[];                                  
  formats: Format[];
  languages: Language[];
  timeBands: { id: TimeBand; label: string }[];
  sorts: { id: string; label: string }[];
  ticketTypes: TicketType[];
  ageRatings: AgeRating[];
  maxSeatsPerOrder: number;                        
  holdMinutes: number;                              
}

export interface Format {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;          
}

export interface Venue {
  id: number;
  slug: string;                
  name: string;
  city: string;
  formats: Format[];            
}

export interface Language {
  id: number;
  slug: string;                  
  name: string;
  code: string;                  
}

export interface Genre {
  id: number;
  slug: string;
  name: string;
}

export type AgeRatingCode = "G" | "PG" | "12+" | "16+" | "18+";

export interface AgeRating {
  code: AgeRatingCode;
  minAge: number;
  description: string;
}

export interface TicketType {
  id: number;
  slug: "adult" | "child" | "student";
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue: Venue | null;
  profileComplete: boolean;
}

export interface Movie {
  id: number;
  slug: string;                  
  title: string;
  kind: "film" | "event";
  runtimeMinutes: number;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  isComingSoon: boolean;
  isNotified: boolean;
  isFeatured: boolean;
  fromPrice: number;
  ageRating: AgeRating;
  genres: Genre[];
  formats: Format[];
}

export interface MovieWithSynopsis extends Movie {
  synopsis: string;
}

export interface MovieDetail extends MovieWithSynopsis {
  director: string | null;
  cast: string | null;
  availableDates: string[];
}

export interface Hall {
  id: number;
  name: string;
}

export type TimeBand = "morning" | "afternoon" | "evening";

export interface Session {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: TimeBand;
  price: number;                 
  seatsLeft: number;
  isSoldOut: boolean;
  hall: Hall;
  venue: Venue;
  format: Format;
  language: Language;
  movie: Movie;
}

export type SeatState = "available" | "sold" | "held" | "unavailable";

export interface Seat {
  id: number;                    
  code: string;                 
  label: string;                 
  state: SeatState;              
  aisleAfter: boolean;
  isMine: boolean;
}

export interface SeatRow {
  label: string;                // "E"
  seats: Seat[];
}

export interface SeatSection {
  name: string;                 // "Stalls"
  rows: SeatRow[];
}

export interface SeatMap {
  sessionId: number;
  hall: Hall & { venue: Venue };
  sections: SeatSection[];     
}

export interface HoldSeat {
  seatId: number;
  code: string;
  ticketType: { slug: string; name: string };
  price: number;
}

export interface SeatHold {
  holdId: string;              
  sessionId: number;
  expiresAt: string;             
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: HoldSeat[];
}

export interface OrderTicket {
  id: number;
  seatCode: string;
  ticketType: { slug: string; name: string };
  price: number;
}

export interface Order {
  id: number;
  reference: string;
  status: "paid" | "refunded";
  totalPrice: number;
  paidAt: string;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;         
  cardLastFour: string;
  contact: { fullName: string; email: string; mobileNumber: string };
  session: Session;
  tickets: OrderTicket[];
}

export interface DataWrapper<T> {
  data: T;
}

export type VenueBrief = Omit<Venue, "formats">;

export interface MovieSession extends Omit<Session, "movie" | "venue" | "hall"> {
  hall: Hall & { venue: VenueBrief };
  venue: VenueBrief;
}

export interface VenueSessions {
  venue: VenueBrief;
  sessions: MovieSession[];
}