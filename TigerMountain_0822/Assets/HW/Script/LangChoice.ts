import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class LangChoice extends ZepetoScriptBehaviour {

    public isKor:boolean;
    public isEng:boolean;

    Kor(){
        this.isKor=true;
        this.isEng=false;
    }

    Eng(){
        this.isEng=true;
        this.isKor=false;
    }

    getKor():boolean{return this.isKor;}
    getEng():boolean{return this.isEng;}

}