import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {PlayerInput,InputAction} from "UnityEngine.InputSystem"
import {CallbackContext} from "UnityEngine.InputSystem.InputAction"
import {CharacterState, ZepetoCharacter, ZepetoPlayers, ZepetoCamera} from 'ZEPETO.Character.Controller'
import {Quaternion, Time, Vector2, Vector3} from "UnityEngine";
import * as UnityEngine from "UnityEngine";
import * as UnityEngineInputSystem from "UnityEngine.InputSystem";
import * as UnityEngineEventSystem from "UnityEngine.EventSystems";

export default class SideViewController extends ZepetoScriptBehaviour {


    public customCamera : UnityEngine.Camera;
    public cameraDistance : number = 10;
    public cameraParent : UnityEngine.GameObject;
    public ccc : UnityEngineInputSystem.InputActionAsset;
    private originSpawnPoint : Vector3 = new Vector3(-16,-5,0);
    private myCharacter: ZepetoCharacter;
    private startPos: Vector2 = Vector2.zero;
    private curPos: Vector2 = Vector2.zero;

    private cameraStartPos: Vector2 = Vector2.zero;
    private cameraCurPos: Vector2 = Vector2.zero;

    private playerInput: PlayerInput;
    private touchPositionAction : InputAction;
    private touchTriggerAction : InputAction;
    private touchCameraPositionAction : InputAction;
    private touchCameraTriggerAction : InputAction;
    private isTriggered: boolean = false;
    private isTouchDown: boolean = false;

    private isCameraTriggered: boolean = false;
    private isCameraTouchDown: boolean = false;

    private xAngle : float;
    private yAngle : float;
    private CanMove() : boolean {
        return this.isTouchDown && !this.isTriggered;
    }
    private CanMoveCam() : boolean {
        return this.isCameraTouchDown && this.isCameraTriggered;
    }

    OnEnable(){
        this.playerInput = this.gameObject.GetComponent<PlayerInput>();
    }
    Start() {
        this.touchPositionAction = this.playerInput.actions.FindAction("Move");
        this.touchCameraTriggerAction = this.playerInput.actions.FindAction("PrimaryTouchContact");
        this.touchCameraPositionAction = this.playerInput.actions.FindAction("PrimaryTouchPosition");
        

        this.touchCameraTriggerAction.add_started((context)=>{
            this.isCameraTriggered = true;
            this.isCameraTouchDown = true;
        });
        this.touchCameraTriggerAction.add_canceled((context)=>{
            this.isCameraTriggered = false;
            this.isCameraTouchDown = false;
        });
        this.touchCameraPositionAction.add_performed((context)=>{
           // console.log(`ssssssssssssssss // ${JSON.stringify(context.ReadValueAsObject() as Vector2)}`);
            //console.log(`touchCameraPositionAction ${context.performed}`);
            var conbool = true;
            this.cameraCurPos = context.ReadValueAsObject() as Vector2;
            console.log(`cameraPos :: ${this.cameraCurPos.x} // ${this.cameraCurPos.y}`);
                if(conbool) {
                    conbool = false;
                    this.cameraStartPos = this.cameraCurPos;
                }
            if(this.isCameraTouchDown)
            {
                this.cameraCurPos = context.ReadValueAsObject() as Vector2;

                if(this.isCameraTriggered) {
                    this.isCameraTriggered = false;
                    this.cameraStartPos = this.cameraCurPos;
                }
            }
        });
  
        this.touchPositionAction.add_performed((context)=>{
            //console.log(`touchPositionAction ${context.performed}`);
            var conbool = true;
            this.curPos = context.ReadValueAsObject() as Vector2;
            //console.log(`cameraPos :: ${this.curPos.x} // ${this.curPos.y}`);
                if(conbool) {
                    conbool = false;
                    this.startPos = this.curPos;
                }
            if(this.isTouchDown)
            {
                this.curPos = context.ReadValueAsObject() as Vector2;

                if(this.isTriggered) {
                    this.isTriggered = false;
                    this.startPos = this.curPos;
                }
            }
        });
        
        //turn off zepeto camera
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
            this.myCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.customCamera.transform.position = this.myCharacter.transform.position + this.originSpawnPoint;
            let characterPos = this.myCharacter.transform.position;
            let cameraPosition = new Vector3(characterPos.x, characterPos.y + 1, characterPos.z - this.cameraDistance);
            this.customCamera.transform.position = cameraPosition;
            this.cameraParent.transform.position = characterPos;
            this.xAngle = this.cameraParent.transform.rotation.eulerAngles.x;
            this.yAngle = this.cameraParent.transform.rotation.eulerAngles.y;
            //this.StartCoroutine(this.InputControlLoop());
        });
    }

    private *InputControlLoop(){
        while(true)
        {
            yield new UnityEngine.WaitForEndOfFrame();
            
            if (this.myCharacter) {
                console.log(`cameraPos :: ${this.cameraCurPos.x} // ${this.cameraCurPos.y}`);
                if(this.startPos.x<UnityEngine.Screen.width/2){
                    var camRot = Quaternion.Euler(0, UnityEngine.Camera.main.transform.rotation.eulerAngles.y, 0);
                    var moveDir = Vector2.op_Subtraction(this.curPos, this.startPos);
                    moveDir = Vector2.op_Division(moveDir, 100);
                    //console.log(`dir : ${moveDir.x} // ${moveDir.y}`);
                    //console.log(`curpos : ${this.curPos.x} // ${this.curPos.y}`);
                    //console.log(`startPos : ${this.startPos.x} // ${this.startPos.y}`);
                    if (moveDir.magnitude > 0) {
    
                        if(moveDir.magnitude > 1)
                            moveDir.Normalize();
    
                        //left-right
                        var optMoveDir = new Vector3(moveDir.x, 0, moveDir.y);
                        optMoveDir = Vector3.op_Multiply(optMoveDir, Time.deltaTime * 80 );
                        
                        this.myCharacter.Move(camRot * optMoveDir);
                    }
                }
                
            }
        }
    }

    //follow zepeto character
    LateUpdate()
    {
        if(null == this.myCharacter)
            {
                return;
            }
            if (this.myCharacter) {
                //console.log(`cameraPos :: ${this.cameraCurPos.x} // ${this.cameraCurPos.y}`);
                if(this.startPos.x<UnityEngine.Screen.width/2){
                    var camRot = Quaternion.Euler(0, UnityEngine.Camera.main.transform.rotation.eulerAngles.y, 0);
                    var moveDir = Vector2.op_Subtraction(this.curPos, this.startPos);
                    moveDir = Vector2.op_Division(moveDir, 100);
                    //console.log(`dir : ${moveDir.x} // ${moveDir.y}`);
                    //console.log(`curpos : ${this.curPos.x} // ${this.curPos.y}`);
                    //console.log(`startPos : ${this.startPos.x} // ${this.startPos.y}`);
                    if (moveDir.magnitude > 0) {
    
                        if(moveDir.magnitude > 1)
                            moveDir.Normalize();
    
                        //left-right
                        var optMoveDir = new Vector3(moveDir.x, 0, moveDir.y);
                        optMoveDir = Vector3.op_Multiply(optMoveDir, Time.deltaTime * 80 );
                        if(this.myCharacter.transform.parent) {
                            this.myCharacter.transform.parent.transform.Translate(camRot * optMoveDir);
                            console.log(`iiiiiii`);
                        }
                        //else this.myCharacter.Move(camRot * optMoveDir);
                    }
                }
                
            }
            else if(!this.myCharacter) console.log(`iiiiiii`);
            let characterPos = this.myCharacter.transform.position;
            this.cameraParent.transform.position = characterPos;
        if(this.isCameraTouchDown){
            var moveDir = Vector2.op_Subtraction(this.cameraCurPos, this.cameraStartPos);
            
            moveDir = Vector2.op_Division(moveDir, 250);
            //moveDir.Normalize();
            this.xAngle += (moveDir.x)  *45* UnityEngine.Time.deltaTime;
            this.yAngle += (moveDir.y) *45* UnityEngine.Time.deltaTime;
            this.cameraParent.transform.rotation = UnityEngine.Quaternion.Euler(this.yAngle,this.xAngle,0);
            
            if (moveDir.magnitude > 0) {
        
                if(moveDir.magnitude > 1)
                    moveDir.Normalize();
    
                //left-right
                
            }
            
        }
        
        
    }
}