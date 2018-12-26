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
    console.log(this.stadiums, this.teams);
    this.setAutoCompleteFilters();
  }

  setAutoCompleteFilters() {
    this.filteredStadiums = this.searchBarObserver(
      this.filterByStadium.bind(this)
    );
    this.filteredTeams = this.searchBarObserver(this.filterByTeam.bind(this));
  }

  searchBarObserver(filter: Function): Observable<string[]> {
    return this.searchBar.valueChanges.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      map((term: string) => {
        return term && term !== '' ? filter(term) : [];
      })
    );
  }

  filterByStadium(term: string) {
    return this.stadiums.filter(stadium => {
      term = term.toLowerCase();
      stadium = stadium.toLowerCase();
      return stadium.startsWith(term);
    });
  }

  filterByTeam(term: string) {
    return this.teams.filter(team => {
      term = term.toLowerCase();
      team = team.toLowerCase();
      return team.startsWith(term);
    });
  }

  selectStadium(stadium: string): void {
    this.appService.selectStadium(stadium);
  }

  selectTeam(stadium: string): void {
    this.appService.selectTeam(stadium);
  }
}
