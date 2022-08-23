import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LangChoice from './LangChoice';

export default class FirstUi extends ZepetoScriptBehaviour {

    public langScript:GameObject;
    public korUI:GameObject;
    public EngUI:GameObject;


    Awake(){
        this.korUI.SetActive(false);
        this.EngUI.SetActive(false);
    }
    Click(){
        
        var kor = this.langScript.GetComponent<LangChoice>().getKor();
        var eng = this.langScript.GetComponent<LangChoice>().getEng();

        if(kor){
            this.korUI.SetActive(true);
            this.EngUI.SetActive(false);
        }else if(eng){
            this.korUI.SetActive(false);
            this.EngUI.SetActive(true);
        }
    }

}