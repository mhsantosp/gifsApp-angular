import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'DGCvncMbqStfbA22KzQcimsfB3MzjAeq';
  private _historial: string[] = [];

  //TODO: cambiarany por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string = '') {

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=DGCvncMbqStfbA22KzQcimsfB3MzjAeq&q=dbz&limit=10z')
    //   .then(res => {
    //     res.json().then(data => {
    //       console.log(data);
    //     })
    //   })

    this.http.get<SearchGifsResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }

}
