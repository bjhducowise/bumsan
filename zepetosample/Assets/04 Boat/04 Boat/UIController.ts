import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Vector3} from "UnityEngine"
import {EventTrigger, EventTriggerType} from "UnityEngine.EventSystems";
import {Entry} from "UnityEngine.EventSystems.EventTrigger";
import { Button } from "UnityEngine.UI"
import { Action, Action$1 } from "System" 
import * as UnityEngine from "UnityEngine";
import * as UnityEngineEV from "UnityEngine.EventSystems";
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { setSourceMapRange } from 'typescript';
export default class UIController extends ZepetoScriptBehaviour {

    public carpetBtn : Button;
    public trigger : EventTrigger;
    public handleGo : GameObject;
    public handleOriginGo : GameObject;
    public downAction : Action;
    public dragAction : Action$1<UnityEngine.Vector3>;
    public upAction : Action;
    
    public isdown : bool;
    
    Start() {
        this.isdown = false;
        this.AddEventTrigger(EventTriggerType.PointerDown, ()=>{
            //console.log('move start');
            //console.log(`move start : ${this.handleOriginGo.transform.position.x} // ${this.handleOriginGo.transform.position.y}`)
            this.isdown = true;
            this.downAction();
        });
        this.AddEventTrigger(EventTriggerType.Drag, ()=>{
            var dir = Vector3.op_Subtraction(this.handleGo.transform.position,this.handleOriginGo.transform.position).normalized;
            //console.log(dir.x, dir.y);
            //this.gameObject.transform.position+=dir;
            this.dragAction(dir);
        });
        this.AddEventTrigger(EventTriggerType.PointerUp, ()=>{
            console.log('move complete');
            this.isdown = false;
            this.upAction();
        });
       
        
    }
    
    public AddEventTrigger(type:EventTriggerType, callback)
    {
        if(this.trigger === undefined) return;
        
        console.log(`this.trigger: ${this.trigger}, type : ${type}`);
        
        // create eventsystem entry
        var entry = new Entry();

        // specify event type & delegation
        entry.eventID = type;
        entry.callback.AddListener(callback);

        // register event entry
        this.trigger.triggers.Add(entry);
    }
    
    public  ShowCarpetButton()
    {
        this.carpetBtn.gameObject.SetActive(true);
    }

    public  HideCarpetButton()
    {
        this.carpetBtn.gameObject.SetActive(false);
    }

}