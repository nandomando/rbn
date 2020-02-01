import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
   private _places = new BehaviorSubject<Place[]>([]);
  //   new Place(
  //     'p1',
  //     'Manhattan Mansion',
  //     'In the heart of New York',
  //     'https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  //     399.99,
  //     new Date('2019-01-01'),
  //     new Date('2024-12-31'),
  //     'abc'
  //   ),
  //   new Place(
  //     'p2',
  //     'White House',
  //     'In AL',
  //     'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  //     150.00,
  //     new Date('2019-01-01'),
  //     new Date('2024-12-31'),
  //     'ac'
  //   ),
  //   new Place(
  //     'p3',
  //     'Casa de Papel',
  //     'In Barcelona',
  //     'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  //     280.00,
  //     new Date('2019-01-01'),
  //     new Date('2024-12-31'),
  //     'abc'
  //   )


  get places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ion-rbn.firebaseio.com/offered-places.json'
      )
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(

              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
              )
            );
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlace(id: string) {
    return this.http
    .get<PlaceData>(
      `https://ion-rbn.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(placeData => {
      return new Place(
        id,
        placeData.title,
        placeData.description,
        placeData.imageUrl,
        placeData.price,
        new Date(placeData.availableFrom),
        new Date(placeData.availableTo),
        placeData.userId
      );
    }));
  }
    // return this.places.pipe(
    //   take(1),
    //   map(places => {
    //     return { ...places.find(p => p.id === id) };
    //   })
    // );

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
      'https://us-central1-ion-rbn.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    imageUrl: string
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{name: string}>('https://ion-rbn.firebaseio.com/offered-places.json', {
        ...newPlace,
        id: null
      })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
          );
        return this.http.put(
            `https://ion-rbn.firebaseio.com/offered-places/${placeId}.json`,
            { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
