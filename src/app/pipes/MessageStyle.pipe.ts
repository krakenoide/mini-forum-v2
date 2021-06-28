import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';
import { Message } from '../models/Message';

@Pipe({
  name: 'messageStyle'
})
export class MessageStylePipe implements PipeTransform {

  constructor(
    private sanitizer: Sanitizer
  ) {}

  transform(message: Message): string {
    return this.replace(message.content);
  }

  replace(str:string):string  { 
    // return str.replace('\[b\](.*?)\[/b\]', '<b>$1</b>');
    return str.replace('\[b\](.*?)\[/b\]', '<b>bold</b>');
    
  }


}