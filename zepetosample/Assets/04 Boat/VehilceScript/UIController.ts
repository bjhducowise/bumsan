import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from "UnityEngine.UI"
export default class UIController extends ZepetoScriptBehaviour {

    public vehicleGenerateBtn : Button;
    
    public  showVehicleButton()
    {
        this.vehicleGenerateBtn.gameObject.SetActive(true);
    }

    public  hideVehicleButton()
    {
        this.vehicleGenerateBtn.gameObject.SetActive(false);
    }

}