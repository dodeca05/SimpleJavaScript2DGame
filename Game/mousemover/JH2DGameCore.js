	var Time={
		sysTime:0,
		rate:1,
		deltaTime:0,
		lastPrTime:0,
		update:function(){
			var d=new Date();
			this.sysTime=d.getTime()
			if(this.lastPrTime==0)this.lastPrTime=d.getTime()
			else{
				
				this.deltaTime=(d.getTime()-this.lastPrTime)*this.rate/1000;
				this.lastPrTime=d.getTime()
				
				//console.log("FPS=",1/this.deltaTime)
				
			}
			
		}
	}
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var GameObjectLst=new Array();
	
	//input mgr
	var InputMgr={
		
		MouseClickEvent :new Array(),
		MouseX:0,
		MouseY:0,
		IsItClick:false,
		KeyPush:new Array()
	
	};
	
	function newGameObject(obName)
	{
		var result={
		name:obName,
		x:0, y:0,
		graphic:null,
		collision:false,
		
		update:function(){},
		collide:function(collobj){},
		collide:function(collobj){},
		ClickThis:function(){},
		MouseOnEnter:function(){}
		};
		
		
		return result;
	}
	function DeleteGameObject(obj)
	{
		var temp=GameObjectLst.splice(GameObjectLst.indexOf(obj),1);
		delete temp;
	}
	function FindObjectByName(name)
	{
		for(var i=0;i<GameObjectLst.length;i++){
			
			if(GameObjectLst[i].name==name)
			return GameObjectLst[i];
		}
		return null;
	}
	function newGraphic(type,depth)
	{
		var result={
			type:type,
			depth:depth, 
			rotate:0
		}
		
		if(type=="rect")//높이 너비 색 지정
		{
			result.height=arguments[2]
			result.width=arguments[3]
			result.color=arguments[4]||"#000000";
		}
		else if(type=="cir")//반지름 색 지정
		{
			result.r=arguments[2]
			result.color=arguments[3]||"#000000";
		}
		else if(type=="img")//가로세로 크기와 이미지 소스 파일 지정
		{
			
			result.img=new Image();
			result.img.src=arguments[2];
			result.height=arguments[3]||img.height;
			result.width=arguments[4]||img.width;
		}
		else if(type=="txt")//글자
		{
			result.text=arguments[2];
			result.height=arguments[3]||-1;
			result.width=arguments[4]||-1;
			result.color=arguments[5]||"#000000";
			result.font=arguments[6]||"10px 바탕체";
		}
		else 
		{
		alert("잘못된 그래픽 생성")
		
		return null;
		}
		return result;
	}
	function registerGameObject(obj)
	{
		GameObjectLst[GameObjectLst.length]=obj;
	}
	
	function runOneFrame()
	{
	///////시간 관련 처리
	Time.update()
	///
	var Graphiclst=new Array();
	////////이벤트 수집
	for(var i=0;i<GameObjectLst.length;i++)
	{
		if(GameObjectLst[i].graphic!=null){
			if(Math.abs(GameObjectLst[i].x-InputMgr.MouseX)<(GameObjectLst[i].graphic.width/2)&&
			Math.abs(GameObjectLst[i].y-InputMgr.MouseY)<(GameObjectLst[i].graphic.height/2))
			{
				if(InputMgr.IsItClick){
				GameObjectLst[i].ClickThis();
				InputMgr.IsItClick=false;
				}
				else
				GameObjectLst[i].MouseOnEnter();
			}
		}
		
		
	}
	////////오브젝트 객체 코드 실행
	GameObjectLst.forEach(function(obj){
		obj.update();
		
		if(obj.graphic!=null){
		obj.graphic.x=obj.x;
		obj.graphic.y=obj.y;
		Graphiclst[Graphiclst.length]=obj.graphic;
		}
	})
	///////그리기
	//깊이 계산
	for(var x=0;x<Graphiclst.length-1;x++)
	{
		for(var y=x+1;y<Graphiclst.length;y++)
		{
			if(Graphiclst[x].depth<Graphiclst[y].depth)
			{
				var temp=Graphiclst[x];
				Graphiclst[x]=Graphiclst[y];
				Graphiclst[y]=temp;
			}
			
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	Graphiclst.forEach(function(grp){
		ctx.beginPath();
		ctx.translate(grp.x,grp.y);
		ctx.rotate((Math.PI / 180)*grp.rotate);
		if(grp.type=="rect")
		{
			ctx.rect(-(grp.width/2),-(grp.height/2),grp.width,grp.height);
			ctx.fillStyle=grp.color;
			ctx.fill();
		}
		else if(grp.type=="cir")
		{
			ctx.arc(0,0,grp.r,0,Math.PI*2,false);
			ctx.fillStyle=grp.color;
			ctx.fill();
		}
		else if(grp.type=="img")
		{
			var img=grp.img;
			var imgH;
			var imgW;
			if(isNaN(grp.height)||isNaN(grp.width)||grp.height<0||grp.width<0)
			{
				imgH=img.height;
				imgW=img.width;
			}
			else{
				imgH=grp.height;
				imgW=grp.width;
			}
			ctx.drawImage(img,-imgW/2,-imgH/2,imgW,imgH)
		}
		else if(grp.type=="txt")
		{
			ctx.font=grp.font;
			ctx.fillStyle=grp.color;
			ctx.fillText(grp.text,0,0);
			
		}
		else{
		alert("잘못된 그리기 요청");
		}
		
		
		ctx.rotate(-(Math.PI / 180)*grp.rotate);
		ctx.translate(-grp.x,-grp.y);
		ctx.closePath()
	})
	}
	function mouseEvent(e,type){
	var cRect = canvas.getBoundingClientRect();        
    var canvasX = Math.round(e.clientX - cRect.left);  
    var canvasY = Math.round(e.clientY - cRect.top); 
	InputMgr.MouseX=canvasX;
	InputMgr.MouseY=canvasY;
	
	if(type=="down"){
		console.log("clickDown");
		InputMgr.IsItClick=true;
		console.log("click : "+canvasX+"/"+canvasY)
	}
	else if(type=="up"){
		InputMgr.IsItClick=false;
	}
}
	
	canvas.addEventListener("mousedown", function(e){
		mouseEvent(e,"down")
	},false);
	canvas.addEventListener("mouseup", function(e){
		mouseEvent(e,"up")
	},false);
	canvas.addEventListener("mousemove", function(e){
		mouseEvent(e,"move")
	},false);



	document.addEventListener("keydown",function(e){
		InputMgr.KeyPush[e.keyCode]=true;
		console.log("keydown :"+e.keyCode)
	},false)
	
		document.addEventListener("keyup",function(e){
		InputMgr.KeyPush[e.keyCode]=false;
		console.log("keyup :"+e.keyCode)
	},false)
	
function MakeClone(obj) {
 var copy={};
 for(var i in obj){
	copy[i]=obj[i]
 }
 copy.graphic={}
 for(var i in obj.graphic)
 {
	 copy.graphic[i]=obj.graphic[i]
 }
  return copy;
}
var runID;
var GameName;
var PlayerName;
function StartGame(FPS,gameName)
{
	GameName=gameName;
	runID=setInterval(runOneFrame,1000/FPS)
	PlayerName=prompt("플레이어 닉네임을 입력하세요")
}

function StopGame()
{
	clearInterval(runID)
	
}
///rank
function setRank(score,op){
	var value=localStorage.getItem(GameName+"_Rank");
	var rankInfo={};
	if(value!=null){
		
		rankInfo=JSON.parse(value);
		for(var i=0;i<rankInfo.Name.length;i++)
		{
			if(PlayerName==rankInfo.Name[i])
			{
				if(rankInfo.Score[i]<score){
					rankInfo.Score[i]=score;
					sortRank(rankInfo,op)
					localStorage.setItem(GameName+"_Rank",JSON.stringify(rankInfo));
					
				}
				return;
			}
			
		}
		rankInfo.Name[rankInfo.Name.length]=PlayerName;
		rankInfo.Score[rankInfo.Score.length]=score;
		sortRank(rankInfo,op)
	}
	else{
		rankInfo.Name=new Array()
		rankInfo.Score=new Array()
		rankInfo.Name[0]=PlayerName
		rankInfo.Score[0]=score
	}
	localStorage.setItem(GameName+"_Rank",JSON.stringify(rankInfo));
}
function sortRank(rankInfo,op){
	
		for(var x=0;x<rankInfo.Score.length-1;x++)
		{
			for(var y=x+1;y<rankInfo.Score.length;y++)
			{
				if(rankInfo.Score[x]>rankInfo.Score[y] && op=="small")
				{
					var temp=rankInfo.Score[x];
					rankInfo.Score[x]=rankInfo.Score[y];
					rankInfo.Score[y]=temp;
					
					temp=rankInfo.Name[x];
					rankInfo.Name[x]=rankInfo.Name[y];
					rankInfo.Name[y]=temp;
					
				}
				else if(rankInfo.Score[x]<rankInfo.Score[y] && op!="small")
				{
					var temp=rankInfo.Score[x];
					rankInfo.Score[x]=rankInfo.Score[y];
					rankInfo.Score[y]=temp;
					
					temp=rankInfo.Name[x];
					rankInfo.Name[x]=rankInfo.Name[y];
					rankInfo.Name[y]=temp;
					
				}
				
			}
			
			
		}
	
}
