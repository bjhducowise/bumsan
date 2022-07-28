
import { GameObject, Rect, Sprite, Texture, Texture2D, Vector2, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRankResponse, LeaderboardAPI, Rank, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard';
import ClientStarter from '../Multiplay/ClientStarter';
import {Image, Text} from 'UnityEngine.UI'
import { Result } from 'UnityEngine.Networking.UnityWebRequest';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoWorldHelper,Users} from 'ZEPETO.World';

var picList:GameObject[];
var textList:GameObject[];
var score:number;
var text:Text;
var name:string;
var clearPreviousScore=true;
var MinTime:number=0;
var ScoreTime:number=1;
var image:Image;
var myRecord:Text;
export default class SetScoreExample extends ZepetoScriptBehaviour 
{
 
    public leaderboardId: string[];
    public startRank: number;
    public endRank: number;
    public resetRule: ResetRule;
    public pictureList:GameObject[];
    public static instance:SetScoreExample;


    public textList:GameObject[];
    public myRecord:GameObject;
    public myPicture:GameObject;
    private cnt:number=0;
    private cnt2:number=0;


    spriteList:Sprite[]=null;
    public static getInstance()

    {
        if (this.instance == null)
        {
            this.instance = new SetScoreExample();
        }

        return this.instance;
    }

    Start()
    {
        textList = this.textList;
        picList = this.pictureList;
        myRecord= this.myRecord.GetComponent<Text>();
        this.StartCoroutine(this.UpdateData(5));

      

        let ids:string[];
        ClientStarter.getInstance().getJoinPlayer().forEach((join)=>
        {
            ids.push(join.getPlayer().zepetoUserId);
        })

        
        ZepetoWorldHelper.GetUserInfo(ids,(info:Users[])=>
        {
            for(let i=0; i<info.length; i++)
            {
                ZepetoWorldHelper.GetProfileTexture( ids[i], (texture:Texture)=>
                {
                    this.spriteList.push(this.GetSprite(texture));
                }, (error)=>
                {
                    console.log(error);
                });
            }
        }, (error)=>
        {
            console.log(error);
        });
       
       
        
    }

    GetSprite(texture:Texture)
    {
        let rect:Rect = new Rect(0,0,texture.width,texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5,0.5));

    }
    OnResult (result:GetRankResponse)
    {
       
    }

    OnResultForSettingScore(result:SetScoreResponse)
    {
        
    }

    OnSetError(error: string) {
        console.error("================SET ERROR===================");
        console.error(error);

        //ClientStarter.getInstance().updateScore(score);
    }


    OnGetError(error: string) {
        console.error("================GET ERROR===================");
        console.error(error);

        //ClientStarter.getInstance().updateScore(score);
    }


    public getScore():number
    {
        return score;
    }
    
  

    public updateRankingBoard()
    {
       
        
    }
    *UpdateData(tick:number)
    {
        score = 100*Math.random();
                        
        LeaderboardAPI.SetScore(this.leaderboardId[MinTime], 0, this.OnResultForSettingScore, this.OnSetError);
        while(true)
        {


            yield new WaitForSeconds(tick);
           
            //must use lambda.
            LeaderboardAPI.GetRangeRank(this.leaderboardId[MinTime] ,this.startRank, this.endRank, this.resetRule, true, (result:GetRankResponse)=>
            {
                //for each text,
                for(let i=0; i<textList.length; i++)
                {
                    score = 100*Math.random();
                    if(result.rankInfo.rankList[this.cnt] != null)
                    {
                        //update score
                        var rank = result.rankInfo.rankList[this.cnt];
                        rank.score = score;
                        LeaderboardAPI.SetScore(this.leaderboardId[MinTime], score, this.OnResultForSettingScore, this.OnSetError);   

                        this.cnt ++;
                    }        

                    //no more item : empty text.
                    else{
                        this.cnt =0;
                    }
                }   

              

                //resort data
                var sortedRank: Rank[] = result.rankInfo.rankList.sort((a,b) =>
                {
                    if(a.score>b.score) return 1;

                    else if (a.score<b.score) return -1;

                    return 0;
                });

                for(let i=0; i<sortedRank.length; i++)
                {
                    var line = textList[i];

                    var pic = picList[i];

                    image = pic.GetComponent<Image>();
                    text = line.GetComponent<Text>();
                    var rank2 = sortedRank[i];
                    text.text = rank2.name + " / " + rank2.score.toString();
                    //image.sprite = this.spriteList[i];
                }

                sortedRank.forEach((rank) =>
                {
                    if(rank.name == ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).name)
                    {
                        
                        myRecord.text = "My Score : "+ rank.score;
                        //this.myPicture.sprite = this.spriteList.find();
                    }
                });
                
            }, this.OnGetError);
        }
    }
}