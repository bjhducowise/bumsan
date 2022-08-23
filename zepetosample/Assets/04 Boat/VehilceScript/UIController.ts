import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from "UnityEngine.UI"
export default class UIController extends ZepetoScriptBehaviour {

    public carpetBtn : Button;
    
    public  showVehicleButton()
    {
        this.carpetBtn.gameObject.SetActive(true);
    }

    public  hideVehicleButton()
    {
        this.carpetBtn.gameObject.SetActive(false);
    }

}