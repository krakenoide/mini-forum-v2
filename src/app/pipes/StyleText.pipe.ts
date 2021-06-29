import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'styletext' })
export class StyleTextPipe implements PipeTransform {
    transform(content: string): string|void {
        if (content.includes("[b]")&&content.includes("[/b]")){
            let debut:string[] = content.split("[b]");
            let fin:string[] = debut[1].split("[/b]");
            return `${debut[0]} ${fin[0].bold()} ${fin[1]}`;
        }
        
        if (content.includes("[i]")&&content.includes("[/i]")){
            let debut:string[] = content.split("[i]");
            let fin:string[] = debut[1].split("[/i]");
            return `${debut[0]} ${fin[0].italics()} ${fin[1]}`;
        }

        if (content.includes("[u]")&&content.includes("[/u]")){
            let debut:string[] = content.split("[u]");
            let fin:string[] = debut[1].split("[/u]");
            return `${debut[0]} <U>${fin[0]}</U> ${fin[1]}`;
        }
        else {
            return content;
        }
    }    
}
