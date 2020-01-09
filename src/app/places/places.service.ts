import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York',
      'https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      399.99
    ),
    new Place(
      'p2',
      'White House',
      'In AL',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      150.00
    ),
    new Place(
      'p3',
      'Casa de Papel',
      'In Barcelona',
      'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      280.00
    )
  ];

  get places() {
    return [...this._places];
  }
  constructor() { }
}
