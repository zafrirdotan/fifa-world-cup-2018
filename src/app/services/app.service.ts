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
  options = {
    header: true,
    skipEmptyLines: true,
  };

  stadiums: string[];
  teams: string[];

  selectedStadium$ = new Subject<string>();
  selectedTeam$ = new Subject<string>();
  selectedGames$ = new Subject<Game[]>();
  constructor(private papa: Papa, private http: HttpClient) {
    this.loadGames();
  }

  loadGames() {
    this.http
      .get('assets/fifa-world-cup-2018.csv', { responseType: 'text' })
      .subscribe(
        data => {
          let result = this.papa.parse(data, this.options);
          this.games = result.data;
          this.setStadiums();
          this.setTeams();
        },
        error => {
          console.log(error);
        }
      );
  }

  getGameByStadium(stadium: string): Game[] {
    console.log( this.games);
    
    return this.games.filter((game)=>{
      return stadium === game.Stadium;
    });
  }

  getGameByTeam(team: string): Game[] {
    console.log( this.games);
    return this.games.filter((game)=>{
      return team === game["Away Team"]|| team === game["Home Team"];
    });
  }

  setTeams() {
    let allTeams: string[] = this.games.map((game: Game) => {
      return game['Home Team'];
    });
    this.teams = this.getUnique(allTeams);
  }

  setStadiums(): void {
    let allStadiums: string[] = this.games.map((game: Game) => {
      return game['Stadium'];
    });
    this.stadiums = this.getUnique(allStadiums);
  }

  getStadiums(): string[] {
    return this.stadiums;
  }

  getTeams(): string[] {
    return this.teams;
  }

  getUnique(array: string[]): any[] {
    return Array.from(new Set(array));
  }

  selectStadium(stadium: string){
    console.log(stadium);
    let games = this.getGameByStadium(stadium);
    this.selectedGames$.next(games);
  }
  
  selectTeam(team: string){
    console.log(team);
    let games = this.getGameByTeam(team);
    this.selectedGames$.next(games);
  }
  
}
