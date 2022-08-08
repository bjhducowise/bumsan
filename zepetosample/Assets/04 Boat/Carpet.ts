import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Vector3, Time, Mathf, Quaternion } from "UnityEngine"
import { Action$1 } from "System"
import * as UnityEngine from "UnityEngine";
export default class Carpet extends ZepetoScriptBehaviour {

    public speed = 2;
    public rotateAction : Action$1<number>;
    private isMovingTrue : bool = false;
    Start() {    

    }
    
    public Move(dir : Vector3)
    {
        
        var moveDir = new Vector3(dir.x, 0, dir.y);
        
        var angle = Mathf.Atan2(dir.x, dir.y) * Mathf.Rad2Deg;
        this.rotateAction(angle);
        
        this.transform.rotation = Quaternion.AngleAxis(angle, Vector3.up);
        
        this.transform.Translate(Vector3.forward * this.speed * Time.deltaTime);
    }
    public  MoveStart()
    {
        console.log("move start");
    }
    
    public  MoveStop()
    {
        console.log("move stop");
    }
    
    public Fly(endValue, duration)
    {
        this.StartCoroutine(this.FlyRoutine(endValue, duration));
    }
    
    //https://gamedevbeginner.com/the-right-way-to-lerp-in-unity-with-examples/
    private * FlyRoutine(endValue, duration)
    {
        var time = 0;
        var startValue = this.transform.position;
        
        while (time < duration)
        {
            this.transform.position = Vector3.Lerp(startValue, endValue, time / duration);
            time += Time.deltaTime;
            yield null;
        }
        this.transform.position = endValue;
    }
    
    

}