import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { AppService } from '../../services/app.service';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchBar = new FormControl();
  filteredStadiums: Observable<string[]>;
  filteredTeams: Observable<any[]>;

  stadiums: string[];
  teams: string[];

  constructor(private appService: AppService) {
    this.stadiums = this.appService.getStadiums();
    this.teams = this.appService.getTeams();
    this.setAutoCompleteFilters();
  }

  // This method listens for changes in the search bar input and filters the
  // stadium and team lists each one separately
  setAutoCompleteFilters(): void {
    this.filteredStadiums = this.searchBarObserver(
      this.filterList.bind(this, this.stadiums)
    );
    this.filteredTeams = this.searchBarObserver(
      this.filterList.bind(this, this.teams)
    );
  }
  // This method is a reuseable method that observes the search bar
  // It takes an filter callback function as is parameter and based on it
  // returns a observable of array of strings.

  searchBarObserver(filter: Function): Observable<string[]> {
    return this.searchBar.valueChanges.pipe(
      // Wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // Ignore new term if same as previous term
      distinctUntilChanged(),

      // For every term return a filtered array
      map((term: string) => {
        return term && term !== '' ? filter(term) : [];
      })
    );
  }

  filterList(array: string[], term: string): string[] {
    return array.filter(item => {
      term = term.toLowerCase();
      item = item.toLowerCase();
      return item.startsWith(term);
    });
  }

  selectStadium(stadium: string): void {
    this.appService.selectStadium(stadium);
  }

  selectTeam(stadium: string): void {
    this.appService.selectTeam(stadium);
  }
}
