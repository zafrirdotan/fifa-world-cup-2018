import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game } from '../interfaces/game';
import { Observable, from, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  games: Game[];
  stadiums: string[];
  teams: string[];

  selectedStadium$ = new Subject<string>();
  selectedTeam$ = new Subject<string>();
  selectedGames$ = new Subject<Game[]>();
  constructor(private papa: Papa, private http: HttpClient) {
    this.loadGames();
  }

  private loadGames() {
    this.http
      .get('assets/fifa-world-cup-2018.csv', { responseType: 'text' })
      .subscribe(
        data => {
          let result = this.papa.parse(data, {
            header: true,
            skipEmptyLines: true,
          });
          this.games = result.data;
          this.setStadiums();
          this.setTeams();
        },
        error => {
          console.log(error);
        }
      );
  }

  private filterGameByStadium(stadium: string): Game[] {
    console.log(this.games);

    return this.games.filter(game => {
      return stadium === game.Stadium;
    });
  }

  private filterGameByTeam(team: string): Game[] {
    console.log(this.games);
    return this.games.filter(game => {
      return team === game['Away Team'] || team === game['Home Team'];
    });
  }

  private setTeams() {
    let allTeams: string[] = this.games.map((game: Game) => {
      return game['Home Team'];
    });
    this.teams = this.getUnique(allTeams);
  }

  public getTeams(): string[] {
    return this.teams;
  }

  private setStadiums(): void {
    let allStadiums: string[] = this.games.map((game: Game) => {
      return game['Stadium'];
    });
    this.stadiums = this.getUnique(allStadiums);
  }

  public getStadiums(): string[] {
    return this.stadiums;
  }

  private getUnique(array: string[]): any[] {
    return Array.from(new Set(array));
  }

  public selectStadium(stadium: string) {
    console.log(stadium);
    let games = this.filterGameByStadium(stadium);
    this.selectedGames$.next(games);
  }

  public selectTeam(team: string) {
    console.log(team);
    let games = this.filterGameByTeam(team);
    this.selectedGames$.next(games);
  }
}
