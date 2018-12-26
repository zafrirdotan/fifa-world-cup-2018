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
    'Away Team',
    'Group',
    'Home Team',
    'Result',
    'Round Number',
    'Stadium',
  ];

  constructor(private appService: AppService, public dialog: MatDialog) {
    this.appService.selectedGames$.subscribe(games => {
      this.games = games;
    });
  }
  openDialog(selectedGame: Game): void {
    const dialogRef = this.dialog.open(GameDetailsComponent, {
      width: '250px',
      data: selectedGame,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
