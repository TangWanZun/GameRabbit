var coverageImage = document.getElementById("coverage");
//页面配置文件
var config = {
	canvasWidth:400,
	canvasHeight:700,
}
//舞台生成文件
var stage = new GRbit.Stage({
	width:config.canvasWidth,
	height:config.canvasHeight,
	scaleX:document.body.offsetWidth/config.canvasWidth,
	scaleY:document.body.offsetHeight/config.canvasHeight,
});
//创建敌机
//var enemy = new Aircraft({
//	x:100,
//	y:100,
//	Z:0,
//	HP:10,
//	imgObj:coverageImage,
//	width:50,
//	height:50,
//	px:41,
//	py:64,
//	pwidth:60,
//	pheight:60,
//	onUpdata:function(){
//		//死亡
//		if(this.HP<0){
//			this.remove();
//			Explode(this.x,this.y);
//		}
//	}
//})
//创建一个我方飞机
var aircraft = new Aircraft({
	x:stage.width/2,
	y:stage.height-100,
	Z:0,
	imgObj:coverageImage,
	width:70,
	height:44,
	px:0,
	py:0,
	pwidth:96,
	pheight:64,
	HP:100,
	onUpdata:function(){
		//限定舞台区域
		if(this.x-this.width/2<=0){
			this.x = this.width/2;
		}
		if(this.y-this.height/2<0){
			this.y = this.height/2;
		}
		if(this.x+this.width/2>=stage.width){
			this.x = stage.width-this.width/2;
		}
		if(this.y+this.height/2>=stage.height){
			this.y = stage.height-this.height/2;
		}
		//发射子弹
		if(GRbit.$roll%5==0&&GRbit.$roll%20!=0){
			let shell = Shell_1(this.x,this.y-this.height/2);
			GRbit.spititList.push(shell);
			GRbit.ArcadeCrash.addCrash(shell,"zd",{
				"zj3":function(obj,obj2){
					if(!obj.isint){
						Flame(obj.x,obj.y-obj.height/2);
						obj2.HP--;
						obj.isint = true;
						obj.remove();
					}
				}
			});
		}
	}
})
onDrag(aircraft);
GRbit.spititList.push(aircraft);
//创建一个街机碰撞
GRbit.ArcadeCrash.addCrash(aircraft,"zj");

//GRbit.spititList.push(enemy);
//GRbit.ArcadeCrash.addCrash(enemy,"zj3",{
//	"zj":function(){
//		return 1;
//	}
//});

//启动碰撞映射
//GRbit.ArcadeCrash.crachMapStart()
//启动街机碰撞
GRbit.ArcadeCrash.start();

//初始化主时间轴
var mainTime = new GRbit.MainTime();
mainTime.start();
