import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  form: FormGroup;
  filterControl: FormControl;
  
  users: User[] = [];
  filteredUsers: User[] = [];
  usersSubscription: Subscription;

  connectedUser: User;
  connectedUserSubscription: Subscription;

  editedUser?: User;
  editUserControl: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private dialog: MatDialog) { }
  

  ngOnInit(): void {
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
    this.usersService.emitUsers();

    this.usersService.connectedUserSubject.subscribe((user: User) => {
      this.connectedUser = user;
    });
    this.usersService.emitConnectedUser();

    this.editUserControl = this.formBuilder.control(['']);
    });

    
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  onChangeEditedUser(user: User): void {
    this.editedUser = (this.editedUser === user) ? undefined : user;
    this.editUserControl.setValue(user.username);
  } 

  onEditUser(user: User): void {
    if (this.editUserControl.valid) {
      this.usersService.updateUser(user, this.editUserControl.value).subscribe((user: User) => {
          this.usersService.users = this.usersService.users.map((userElt: User) => {
              if (userElt.id === user.id) {
                  userElt.username = user.username;
              }

              return userElt;
           });

           this.usersService.emitUsers();

           this.snackBar.open("L'utilisateur a bien été modifié", "Fermer", { duration: 3000 });

           this.editedUser = undefined;
      }, error => {
          this.snackBar.open("Une erreur est survenue. Veuillez vérifier votre saisie", "Fermer", { duration: 3000 });
      });
  }
  }

  onDeleteTopic(topic: User): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
          title: "Êtes-vous sûr de vouloir supprimer ce sujet ?",
          content: "Cette action est irréversible.",
          action: "Supprimer"
      },
      autoFocus: false
  });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
          this.topicsService.deleteTopic(topic).subscribe(response => {
              this.topicsService.topics = this.topicsService.topics.filter(topicElt => topicElt.id !== topic.id);
              this.topicsService.emitTopics();
  
              this.editedTopic = undefined;
  
              this.snackBar.open("L'utilisateur a bien été supprimé", "Fermer", { duration: 3000 });
          }, error => {
              this.snackBar.open("Une erreur est survenue. Veuillez vérifier votre saisie", "Fermer", { duration: 3000 });
          });
      }
  });
  }

  getErrorMessage(formControlName: string | null, formControlParam?: FormControl): string|void {
    const formControl = (formControlName !== null) ? this.form.controls[formControlName] : formControlParam;

    if (formControl!.hasError('required')) {
        return 'Ce champ est obligatoire';
    }

    if (formControl!.hasError('minlength')) {
        return 'Vous devez entrer au moins ' + formControl!.getError('minlength').requiredLength + ' caractères';
    }

    if (formControl!.hasError('maxlength')) {
        return 'Vous ne pouvez pas entrer plus de ' + formControl!.getError('maxlength').requiredLength + ' caractères';
    }
  }

}
