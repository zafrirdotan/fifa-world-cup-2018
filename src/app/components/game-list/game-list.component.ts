import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Game } from '../../interfaces/game';
import { MatDialog } from '@angular/material';
import { GameDetailsComponent } from '../game-details/game-details.component';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent {
  games: Game[] = [];
  Stadium: string;
  displayedColumns: string[] = [
    'Stadium',
    'Date',
    'Group',
    'Round Number',
    'Away Team',
    'Home Team',
    'Result',
  ];

  constructor(private appService: AppService, public dialog: MatDialog) {
    this.appService.selectedGames$.subscribe(games => {
      console.log(games);
      
      this.games = games;
    });
  }

  openDialog(selectedGame: Game): void {
    const dialogRef = this.dialog.open(GameDetailsComponent, {
      width: '500px',
      height: '500px',
      data: selectedGame,
    });
 
  }

}
