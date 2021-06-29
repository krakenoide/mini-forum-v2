import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'styletext' })
export class StyleTextPipe implements PipeTransform {
    transform(content: string): string {
        while (content.includes("[")){
            content=content.replace("[","<");
            content=content.replace("]",">");
        }
        return content;
    }    
}
