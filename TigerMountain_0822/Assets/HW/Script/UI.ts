import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject } from 'UnityEngine';
import LangChoice from './LangChoice';

export default class UI extends ZepetoScriptBehaviour {

    public langScript:GameObject;
    public KorUI:GameObject;
    public EngUI:GameObject;


    Awake(){
        this.KorUI.SetActive(false);
        this.EngUI.SetActive(false);
    }
    Click(){
        
        var kor = this.langScript.GetComponent<LangChoice>().getKor();
        var eng = this.langScript.GetComponent<LangChoice>().getEng();

        if(kor==true){
            this.KorUI.SetActive(true);
            this.EngUI.SetActive(false);
        }else if(eng==true){
            this.KorUI.SetActive(false);
            this.EngUI.SetActive(true);
        }
    }

}