import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
 
export default class Rotator extends ZepetoScriptBehaviour {
 
    //변수 생성 -> inspector에서 숫자값을 조정하면서 편하게 회전 값 변경 가능
    public rotatorX : number=0;
    public rotatorY : number=0;
    public rotatorZ : number=3;
 
    Start() {    
 
    }
 
    Update(){
        this.transform.Rotate(this.rotatorX,this.rotatorY,this.rotatorZ);
    }
 
}
