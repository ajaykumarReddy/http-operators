import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { keepFresh, shareAndCache, retryExponentialBackoff } from 'http-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  repos;
  constructor(private http: HttpClient) {
    const path = `https://api.github.com/search/repositories?q=angular`;
    this.repos = this.http.get<any>(path).pipe(
      map(res => res.items),
      retryExponentialBackoff(3, 1000),
      keepFresh(10 * 1000),
      shareAndCache('myapp-repos'),
    );
  }
}
