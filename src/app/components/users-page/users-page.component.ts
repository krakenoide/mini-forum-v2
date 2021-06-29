import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  filterControl: FormControl;

  users: User[] = [];
  filteredUsers: User[] = [];
  usersSubscription: Subscription;

  connectedUser: User;
  connectedUserSubscription: Subscription;

  editedUser?: User;
  editUserControl: FormControl;

  dialogRefSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.usersService.getUsers();

    this.editUserControl = this.formBuilder.control('');

    this.usersService.usersSubject.subscribe((users: User[]) => {
      this.users = users;
      this.filteredUsers = users;

      this.filterControl = this.formBuilder.control('');



      this.filterControl.valueChanges.subscribe(filterValue => {
        if (filterValue) {
          this.filteredUsers = this.users.filter(user => user.username.includes(filterValue));
        } else {
          this.filteredUsers = this.users;
        }
      });


    });
    this.usersService.emitUsers();


    this.usersService.connectedUserSubject.subscribe((user: User) => {
      this.connectedUser = user;
    });
    this.usersService.emitConnectedUser();
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription.unsubscribe();
    }
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  onChangeEditedUser(user: User): void {
    this.editedUser = (this.editedUser === user) ? undefined : user;
    this.editUserControl.setValue(user.username);
  }

  onEditUser(user: User): void {
    if (this.editUserControl.valid) {
      this.usersService.updateUserAdmin(user, this.editUserControl.value, this.connectedUser).subscribe((user: User) => {
        this.usersService.users = this.usersService.users.map((userElt: User) => {
          if (userElt.id === user.id) {
            userElt.username = user.username;
          }

          return userElt;
        });

        this.usersService.getUsers();
        this.usersService.emitUsers();

        this.snackBar.open("L'utilisateur a bien été modifié", "Fermer", { duration: 3000 });

        this.editedUser = undefined;
      }, error => {
        this.snackBar.open("Une erreur est survenue. Veuillez vérifier votre saisie", "Fermer", { duration: 3000 });
      });
    }
  }

  changeRights(user: User): void {
    console.log(user.admin);
    this.usersService.userToAdmin(user, user.username, this.connectedUser, !user.admin).subscribe((user: User) => {

      this.usersService.getUsers();
      this.usersService.emitUsers();

      this.snackBar.open("Les droits utilisateur ont bien été modifiés", "Fermer", { duration: 3000 });
      this.router.navigate(['users-page']);
      this.editedUser = undefined;
    }, error => {
      this.snackBar.open("Une erreur est survenue. Veuillez vérifier votre saisie", "Fermer", { duration: 3000 });
    });

  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
        content: "Cette action est irréversible.",
        action: "Supprimer"
      },
      autoFocus: false
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.usersService.deleteUser(user).subscribe(response => {
          this.usersService.users = this.usersService.users.filter(userElt => userElt.id !== user.id);
          this.usersService.emitUsers();

          this.editedUser = undefined;

          this.snackBar.open("L'utilisateur a bien été supprimé", "Fermer", { duration: 3000 });
        }, error => {
          this.snackBar.open("Une erreur est survenue. Veuillez vérifier votre saisie", "Fermer", { duration: 3000 });
        });
      }
    });
  }

  getErrorMessage(formControlName: string | null, formControlParam?: FormControl): string | void {
    const formControl = (formControlName !== null) ? this.form.controls[formControlName] : formControlParam;

    if (formControl!.hasError("required")) {
      return "Ce champ est obligatoire";
    }

    if (formControl!.hasError("minlength")) {
      return "Vous devez entrer au moins " + formControl!.getError("minlength").requiredLength + " caractères";
    }

    if (formControl!.hasError("maxlength")) {
      return "Vous ne pouvez pas entrer plus de " + formControl!.getError("maxlength").requiredLength + " caractères";
    }
  }

}
