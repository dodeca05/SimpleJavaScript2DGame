//초기 화면
var IsGameRun=false
var TitleCard1=newGameObject("titleCard")
TitleCard1.graphic=newGraphic("img",0,"./src/ace_of_spades.png",184,125)
TitleCard1.x=512-40
TitleCard1.y=360
TitleCard1.graphic.rotate=-15

var TitleCard2=newGameObject("titleCard2")
TitleCard2.graphic=newGraphic("img",1,"./src/king_of_spades.png",184,125)
TitleCard2.x=512+40
TitleCard2.y=360
TitleCard2.graphic.rotate=15
var GameTitleText=newGameObject("titleText")
GameTitleText.graphic=newGraphic("txt",-1,"♠Black Jack♣",-1,-1,"#000000","100px 함초롱바탕")
GameTitleText.x=230
GameTitleText.y=100
var GameStartButton=newGameObject("startbtn")
GameStartButton.graphic=newGraphic("rect",10,100,300,"#00AAAA")
var btnText=newGameObject("btnText")
btnText.graphic=newGraphic("txt",-1,"GameStart",-1,-1,"#FFFFFF","40px 함초롱바탕")
btnText.x=420
btnText.y=600
GameStartButton.x=512
GameStartButton.y=600
GameStartButton.ClickThis=function()
{
	
	DeleteGameObject(btnText)
	DeleteGameObject(GameTitleText)
	DeleteGameObject(this)
	DeleteGameObject(TitleCard1)
	DeleteGameObject(TitleCard2)
	IsGameRun=true
	alert("초기 자금은 1000원 입니다.\n게임을 진행하면서 5000원을 만들어보세요!");
	GameStart();
	
}
registerGameObject(TitleCard1)
registerGameObject(TitleCard2)
registerGameObject(GameTitleText)
registerGameObject(GameStartButton)
registerGameObject(btnText)
StartGame(60,"블랙잭")


/////////////////////////////////게임시작
var money=1000;
///카드 프리펩
var CardPrefab=newGameObject("Card")
CardPrefab.cardValue=0;
CardPrefab.cardShape=0;
CardPrefab.setCardImg=function(num,shape){
	var str="./src/"
	if(1<num&&num<=10)str+=String(num);
	else if(num==1)str+="ace";
	else if(num==11)str+="jack";
	else if(num==12)str+="queen";
	else if(num==13)str+="king";
	str+="_of_";
	var shapeTxt=["spades","diamonds","hearts","clubs"];
	str+=shapeTxt[shape]
	str+=".png"
	this.graphic=newGraphic("img",1,str,184,125)
	this.cardValue=num;
	this.cardShape=shape;
}
CardPrefab.setFront=function(){
	
	this.setCardImg(this.cardValue,this.cardShape)
}
CardPrefab.setBack=function(){
	this.graphic=newGraphic("img",1,"./src/back.png",184,125)
}
CardPrefab.setFrontWithAnimation=function(){
	this.temp=125;
	this.update=function(){
		
		
		this.temp-=Time.deltaTime*300;
		if(this.temp<0)this.setFront()
		this.graphic.width=Math.floor(Math.abs(this.temp))
	
		if(this.temp<=-125){
			this.graphic.width=125
			this.update=function(){
				
				this.graphic.width=125
			}
		}
		
		
		console.log(this.graphic.width)
		
	}
}
CardPrefab.update=function(){
	
}
//var playerCards=new Array()
//var DillerCards=new Array()
var GameMgr;
var VetMoney=0;
function GameStart()
{
	var DtableUI=newGameObject("DtableUI");
	DtableUI.graphic=newGraphic("txt",20,"<<Diller",-1,-1,"#AACCAA","80px 함초롱바탕")
	DtableUI.x=512
	DtableUI.y=250
	registerGameObject(DtableUI)
	
	var PtableUI=newGameObject("PtableUI");
	PtableUI.graphic=newGraphic("txt",20,"<<Player",-1,-1,"#AACCAA","80px 함초롱바탕")
	PtableUI.x=512
	PtableUI.y=420
	registerGameObject(PtableUI)
	
	var moneyUI=newGameObject("moneyUI")
	moneyUI.graphic=newGraphic("txt",-1,"소지금액\n"+money.toString()+"원",-1,-1,"#FFFFFF","30px 함초롱바탕")
	moneyUI.x=20
	moneyUI.y=30
	moneyUI.update=function()
	{
		this.graphic.text="소지금액 : "+money.toString()+"원 베팅금액 : "+VetMoney.toString()+"원"
		
	}
	registerGameObject(moneyUI)
	
	
	var moreCardBtn=newGameObject("moreCardBtn")
	moreCardBtn.NewCardX=440
	moreCardBtn.graphic=newGraphic("img",10,"./src/morebtn.png",100,300)
	moreCardBtn.x=320
	moreCardBtn.y=620
	moreCardBtn.ClickThis=function(){
		if(GameMgr.state==-4){
			GameMgr.state=0
			DeleteGameObject(FindObjectByName("endgame"))
			return;
		}
		if(GameMgr.state!=7)return;
		
		
		var temp=MakeClone(CardPrefab)
		var cardnum=GameMgr.NewCard()
		temp.x=this.NewCardX;
		temp.y=400;
		temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
		temp.setBack();
		registerGameObject(temp)
		GameMgr.PlayerCards[GameMgr.PlayerCards.length]=temp;
		temp.setFrontWithAnimation()
		this.NewCardX+=120
	}
	registerGameObject(moreCardBtn);
	
	var StopBtn=newGameObject("StopBtn")
	StopBtn.graphic=newGraphic("img",10,"./src/stopbtn.png",100,300)
	StopBtn.x=720
	StopBtn.y=620
	StopBtn.ClickThis=function(){
		
		if(GameMgr.state==7)
		{
			
			GameMgr.state=10
			GameMgr.DillerCards[1].setFrontWithAnimation();
		}
	}
	registerGameObject(StopBtn);
	
	
	
	GameMgr=newGameObject("Mgr")
	GameMgr.state=-1
	GameMgr.CardUsed=new Array(52)
	GameMgr.limit=5000
	GameMgr.NewCard=function()
	{
		 var v=Math.floor(Math.random() * 52);
		 if(this.CardUsed[v]==true)
		 {
			 return this.NewCard()
		 }
		 else
		 {
			 this.CardUsed[v]=true;
			 return v;
		 }
		
	}
	GameMgr.update=function(){
		if(this.state==-4){
			
			
		}
		else if(this.start==-3){StopGame()}
		else if(this.state==-2){
			for(var i=0;i<52;i++)
				this.CardUsed[i]=false;
			
			if(money<=0){
			//게임 패배
			alert("게임패배")
			var GameLostTxt=newGameObject("endgame")
			GameLostTxt.graphic=newGraphic("txt",-2,"소지금이 0원이 됬습니다. F5를 눌러 게임을 다시 도전해 보세요.",-1,-1,"#FFFFFF","30px 함초롱바탕")
			GameLostTxt.x=20;
			GameLostTxt.y=300;
			registerGameObject(GameLostTxt);
			this.state=-4;
			
			
			}
			
			else if(money>=this.limit){
			
			alert("게임승리")
			
			var GameWinTxt=newGameObject("endgame")
			GameWinTxt.graphic=newGraphic("txt",-2,"목표금액을 달성했습니다! 계속 하실려면 카드 더받기를 눌러주세요",-1,-1,"#FFFFFF","30px 함초롱바탕")
			GameWinTxt.x=20;
			GameWinTxt.y=300;
			registerGameObject(GameWinTxt);
			this.limit=Infinity;
			this.state=-5;
			
			}
			for(var i=0;i<this.DillerCards.length;i++)
			{
				DeleteGameObject(this.DillerCards[i])
			}
			for(var i=0;i<this.PlayerCards.length;i++)
			{
				DeleteGameObject(this.PlayerCards[i])
			}
			
			
			this.state++;
			
		}
		
		else if(this.state==-1)this.state++;
		
		else if(this.state==0)
		{
			this.DillerCards=new Array()
			this.PlayerCards=new Array()
			var temp;
			while(true){
			temp=Number(prompt("베팅금액을 입력하세요"))
			if(!isNaN(temp)&&(temp>0&&temp<=money))break;
			alert("잘못된 입력입니다")
			}
			setRank(money,"")
			VetMoney=temp;
			money-=VetMoney;
			this.state=1
		}
		else if(this.state==1)
		{
			//초기 셋팅
			 var temp=MakeClone(CardPrefab)
			 var cardnum=this.NewCard()
			 console.log(cardnum,cardnum%13+1,Math.floor(cardnum/13))
			 temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
			 temp.x=200;
			 temp.y=200;
			 temp.setBack();
			 registerGameObject(temp)
			 this.DillerCards[this.DillerCards.length]=temp;
			 temp.setFrontWithAnimation()
			 
			 temp=MakeClone(CardPrefab)
			 cardnum=this.NewCard()
			 temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
			 temp.x=320;
			 temp.y=200;
			 temp.setBack();
			 registerGameObject(temp)
			 this.DillerCards[this.DillerCards.length]=temp;
			 
			 
			 temp=MakeClone(CardPrefab)
			 cardnum=this.NewCard()
			 temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
			 temp.x=200;
			 temp.y=400;
			 temp.setBack();
			 registerGameObject(temp)
			 this.PlayerCards[this.PlayerCards.length]=temp;
			 temp.setFrontWithAnimation()
			 
			 temp=MakeClone(CardPrefab)
			 cardnum=this.NewCard()
			 temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
			 temp.x=320;
			 temp.y=400;
			 temp.setBack();
			 registerGameObject(temp)
			 this.PlayerCards[this.PlayerCards.length]=temp;
			 temp.setFrontWithAnimation()
			 
			 moreCardBtn.NewCardX=440;
			 
			 this.state++;
			 this.temp=0;
		}
		else if(this.state==2)//1초동안 대기
		{
			this.temp+=Time.deltaTime;
			if(this.temp>1)this.state=3
			
		}
		else if(this.state==3)
		{
			if(this.DillerCards[0].cardValue==1||this.DillerCards[0].cardValue==10||this.DillerCards[0].cardValue==11||this.DillerCards[0].cardValue==12||this.DillerCards[0].cardValue==13)
			{
					
			if(confirm("딜러가 블랙잭 일까요?")){
					
					this.state=4;
					Time.deltaTime=0;
					this.DillerCards[1].setFrontWithAnimation();
					this.temp=0;
				}else 
				{
					
					this.state=7
				}
			
			
			}else this.state=7
			
			
		}
	else if(this.state==4)
		{
			this.temp+=Time.deltaTime;
			if(this.temp>1)this.state=5
		}
	else if(this.state==5)
		{
			var a=this.DillerCards[0].cardValue;
			var b=this.DillerCards[1].cardValue;
			if(a>10)a=10;
			else if(a==1)a=11;
			if(b>10)b=10;
			else if(b==1)b=11;
			
			if((a+b)==21)
			{
				alert("딜러는 블랙잭이었습니다! 승리하셨습니다. 배팅금의 1.5배를 얻었습니다")
				money+=(VetMoney*1.5)
			}
			else alert("딜러는 블랙잭이 아니었습니다! 패배하셨습니다.")
			
			VetMoney=0;
			this.temp=0;
			this.state=6;
		}
		else if(this.state==6)
		{
			this.temp+=Time.deltaTime;
			if(this.temp>1)this.state=-2
		}
		else if(this.state==7)
		{
			var sum=0;
			var Acount=0;
			for(var i=0;i<this.PlayerCards.length;i++)
			{
				var temp=this.PlayerCards[i].cardValue;
				if(temp==1)Acount++;
				if(temp>10)temp=10;
				sum+=temp;
			
			}
			if(sum>21)
			{
				this.temp=0;
				this.state=8
				
			}
			else if(sum==21||(Acount>0&&(sum+10)==21)){
				
				this.temp=0;
				this.state=9;
				
			}
			
			
		}
		else if(this.state==8){
			
			this.temp+=Time.deltaTime;
			if(this.temp>2){
			alert("숫자 합이 21이 넘었습니다! 버스트입니다");
				this.state=-2;
			}
		}
		else if(this.state==9){
			
			this.temp+=Time.deltaTime;
			if(this.temp>2){
			money+=(VetMoney*2.5)
			alert("블랙잭입니다! 배팅금의 2.5배를 받습니다.!");
			
				this.state=-2;
			}
		}
		else if(this.state==10)
		{
			var sum=0;
			var Acount=0;
			for(var i=0;i<this.PlayerCards.length;i++)
			{
				var temp=this.PlayerCards[i].cardValue;
				if(temp==1)Acount++;
				if(temp>10)temp=10;
				sum+=temp;
			
			}
			
			if(Acount>0)
			{
				sum+=10;
				if(sum>21)
					sum-=10;
			}
			
			
			
			
			
			function GetDRsum(){
				var sum=0;
				var Acount=0;
				for(var i=0;i<GameMgr.DillerCards.length;i++)
				{
					var temp=GameMgr.DillerCards[i].cardValue;
					if(temp==1)Acount++;
					if(temp>10)temp=10;
					sum+=temp;
			
				}
			
				if(Acount>0)
				{
					sum+=10;
					if(sum>21)
					sum-=10;
				}
				return sum;
			}
			var DRCardX=440
			while(GetDRsum()<17)
			{
				var temp=MakeClone(CardPrefab);
				var cardnum=this.NewCard()
				temp.setCardImg(cardnum%13+1,Math.floor(cardnum/13))
				temp.x=DRCardX;
				temp.y=200;
				temp.setBack();
				registerGameObject(temp)
				temp.setFrontWithAnimation();
				this.DillerCards[this.DillerCards.length]=temp;
				DRCardX+=120
			}
			this.temp=0;
			if(GetDRsum()>21)
				this.state=11;
			else if(GetDRsum()==sum)
				this.state=12;
			else if(GetDRsum()<sum)
				this.state=13;
			else if(GetDRsum()>sum)
				this.state=14;
			
			
		}
		else if(this.state>=11)
		{
			this.temp+=Time.deltaTime;
			if(this.temp>2)
			{
				if(this.state==11){
					money+=VetMoney*2;
					alert("딜러가 버스트입니다! 베팅금액의 2배를 받습니다");
					this.state=-2
				}
				
				else if(this.state==12){
					money+=VetMoney;
					alert("무승부 입니다! 베팅금액을 돌려받습니다");
					this.state=-2
				}
				else if(this.state==13){
					money+=VetMoney*2;
					alert("플레이어의 승리입니다! 베팅금액의 2배를 받습니다");
					this.state=-2
				}
				else if(this.state==14){
					
					alert("플레이어의 패배입니다!");
					this.state=-2
				}
			}
		}
		
	
	}
	registerGameObject(GameMgr)
	
	
	
}

