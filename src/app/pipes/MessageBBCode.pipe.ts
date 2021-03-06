import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/Message';

@Pipe({
  name: 'messageBBCode'
})
export class MessageBBCodePipe implements PipeTransform {

  constructor(
  ) {}

  transform(message: Message): string {
    return this.replaceWithRegex(message.content);
  }

  //not currentky used, just another option to replace characters

  replace(str:string):string  { 

    while (str.includes('[')){
      str = str.replace('[', '<');
      str = str.replace(']', '>');
    }
    
    return  str;   
  }

  // Regex Testers
  // https://regex101.com/r/ijxJPG/1/
  // https://www.regextester.com/97589

  replaceWithRegex(str:string):string  { 

    str = str.replace(/\[([b,i,u]?)\]/gm,"<$1>") ;
    str = str.replace(/\[\/([b,i,u]?)\]/gm, "</$1>");

    return  str;   
  }

}



