import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  usersSubscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.usersService.usersSubject.subscribe((users: User[]) => {
      this.users = users;}),
    this.usersService.emitUsers();
    }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
  }
  }

}
