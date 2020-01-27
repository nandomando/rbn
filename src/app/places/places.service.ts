import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York',
      'https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      399.99,
      new Date('2019-01-01'),
      new Date('2024-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'White House',
      'In AL',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      150.00,
      new Date('2019-01-01'),
      new Date('2024-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Casa de Papel',
      'In Barcelona',
      'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      280.00,
      new Date('2019-01-01'),
      new Date('2024-12-31'),
      'abc'
    )
  ]);

  get places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(p => p.id === id) };
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260', 
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    this.places.pipe(take(1)).subscribe(places => {
      setTimeout(() => {
        this._places.next(places.concat(newPlace));
      }, 1000);
    });
  }
}
