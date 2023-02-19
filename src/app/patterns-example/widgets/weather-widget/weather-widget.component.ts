import { WIDGET } from './../widget.token';
import { Component } from '@angular/core';
import { Widget } from '../widget.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import {WeatherResponse} from './weather-response.interface';
import { timer } from 'rxjs';
@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
  providers: [
    {
      provide: WIDGET,
      useExisting: WeatherWidgetComponent,
    },
  ],
})
export class WeatherWidgetComponent implements Widget {
  isLoading = false;
  tempDeg: number;
  iconUrl: string;
  iconText: string;

  constructor(
    private http: HttpClient
  ) { }

  load() {
    this.http.get(`https://api.weatherapi.com/v1/current.json?key=${environment.weatherKey}&q=22.5179,88.3834&aqi=yes`)
    .subscribe((data: WeatherResponse) => {
      this.isLoading = false;

      const {temp_c, condition:{icon, text}} = data.current;
      this.tempDeg = temp_c;
      this.iconUrl = icon;
      this.iconText = text;

    }, error => {
      console.log('error', error);
    });
  }

  refresh() {
    this.isLoading = true;
    timer(2000).subscribe(() => this.load())
  }
}
