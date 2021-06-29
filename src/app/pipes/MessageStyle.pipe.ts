import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/Message';

@Pipe({
  name: 'messageStyle'
})
export class MessageStylePipe implements PipeTransform {

  constructor(
  ) {}

  transform(message: Message): string {
    return this.replace(message.content);
  }

  replace(str:string):string  { 
    while (str.includes('[')){
      str = str.replace('[', '<');
      str = str.replace(']', '>');
    }
    return  str;   
  }


}