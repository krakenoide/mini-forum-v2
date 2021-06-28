import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/Message';

@Injectable()
export class MessagesService {
    apiUrl = 'http://localhost:8080/api/message/';

    messages: Message[] = [];
    messagesSubject = new Subject<Message[]>();

    constructor(private httpClient: HttpClient) {
        this.httpClient.get<Message[]>(this.apiUrl, { observe: 'body' }).subscribe((messages: Message[]) => {
            this.messages = messages.map(message => {
                message.date = new Date(message.date);
                return message;
            });

            this.emitMessages();
        });
    }

    emitMessages(): void {
        this.messagesSubject.next(this.messages);
    }

    postNewMessage(message: Message): Observable<Message> {
        return this.httpClient.post<Message>(this.apiUrl, message);
    }

    deleteMessage(message: Message): Observable<any> {
        return this.httpClient.delete(this.apiUrl + message.id);
    }
}