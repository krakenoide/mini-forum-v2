import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'styletext' })
export class StyleTextPipe implements PipeTransform {
    transform(content: string): string|void {
        if (content.includes("[b]")&&content.includes("[/b]")){
            let debut:string[] = content.split("[b]");
            let phrasestyle:string[]=[];
            let phrasepasstyle:string[]=[];
            let phrasefinale:string=debut[0];
            for (let i=1;i<debut.length;i++){
                phrasestyle.push(debut[i].split("[/b]")[0].bold());
                phrasepasstyle.push(debut[i].split("[/b]")[1]);
            }
            for (let i=0;i<phrasestyle.length;i++){
                phrasefinale+=phrasestyle[i];
                phrasefinale+=phrasepasstyle[i];
            }
            return phrasefinale;
        }

        if (content.includes("[i]")&&content.includes("[/i]")){
            let debut:string[] = content.split("[i]");
            let phrasestyle:string[]=[];
            let phrasepasstyle:string[]=[];
            let phrasefinale:string=debut[0];
            for (let i=1;i<debut.length;i++){
                phrasestyle.push(debut[i].split("[/i]")[0].italics());
                phrasepasstyle.push(debut[i].split("[/i]")[1]);
            }
            for (let i=0;i<phrasestyle.length;i++){
                phrasefinale+=phrasestyle[i];
                phrasefinale+=phrasepasstyle[i];
            }
            return phrasefinale;
        }

        if (content.includes("[u]")&&content.includes("[/u]")){
            let debut:string[] = content.split("[u]");
            let phrasestyle:string[]=[];
            let phrasepasstyle:string[]=[];
            let phrasefinale:string=debut[0];
            for (let i=1;i<debut.length;i++){
                phrasestyle.push("<U>"+debut[i].split("[/u]")[0]+"</U>");
                phrasepasstyle.push(debut[i].split("[/u]")[1]);
            }
            for (let i=0;i<phrasestyle.length;i++){
                phrasefinale+=phrasestyle[i];
                phrasefinale+=phrasepasstyle[i];
            }
            return phrasefinale;
        }

        else {
            return content;
        }
    }    
}
