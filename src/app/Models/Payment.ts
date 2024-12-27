export interface Car {
  id?: number;
  regNo: string;
  carType: string;
}

export interface Client {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Service {
  id: number;
  serviceType?: string;
  price?: number;
}

export interface Payment {
  id?: number;
  car: Car;
  client: Client;
  service: Service;  // Changement : tableau de services au lieu d'un seul service
  givenPrice: number;
  paymentType: string;
  status: string;
  entryTime: string;
  additionalDetails: string;
  paymentDate: string;
  isPaidNow: string;
  //totalPrice?: number;  // Nouveau champ : totalPrice pour stocker la somme des services sélectionnés
}
