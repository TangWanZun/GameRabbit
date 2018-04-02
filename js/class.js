//注册一个组件自定义的事件，拖动事件
onDrag = function(spitit){
	spitit.$NX = 0;
	spitit.$NY = 0;
	self.addEventListener("touchstart",function(e){
		spitit.$NX = e.touches[0].pageX - spitit.x;
		spitit.$NY = e.touches[0].pageY - spitit.y;
	});
	self.addEventListener("touchmove",function(e){
		var sp = e.touches[0].pageX-spitit.$NX;
		//改变水平仪
		if(sp<spitit.x&&aircraft.Z<=0){
			//左移动
			aircraft.Z--;
		}else if(sp>spitit.x&&aircraft.Z>=0){
			//右移动
			aircraft.Z++;
		}else{
			//不移动
			aircraft.Z = 0;
			aircraft.px = 0;
		}
		//用来控制飞机移动时，改变飞机倾斜度
		if(aircraft.Z < -15){
			if(aircraft.Z < -20){
				aircraft.px = 388;
			}else{
				aircraft.px = 96;
			}
		}else if(aircraft.Z > 15){
			if(aircraft.Z > 20){
				aircraft.px = 292;
			}else{
				aircraft.px = 198;
			}
		}
		//重绘碰撞体
		GRbit.ArcadeCrash.resetDraw(aircraft);
		spitit.x = e.touches[0].pageX - spitit.$NX;
		spitit.y = e.touches[0].pageY - spitit.$NY;
	});
	self.addEventListener("touchend",function(e){
		spitit.$NX = 0;
		spitit.$NY = 0;
		aircraft.Z = 0;
		aircraft.px = 0;
		//重绘碰撞体
		GRbit.ArcadeCrash.resetDraw(aircraft);
	});
}
//飞机类
var Aircraft = function(Pro){
	GRbit.ImgSpitit.call(this,Pro);
	this.HP = Pro.HP;
	//水平仪
	this.Z = Pro.Z;
	//子弹类型
	this.shellType = 1;
	//y轴方向的移动速度
	this.vy = Pro.vy;
	//x轴方向的移动速度
	this.vx = Pro.vx;
	//旋转角度
	this.rotate = Pro.rotate;
}
//通用子弹类
var Shell = function(Pro){
	GRbit.ImgSpitit.call(this,Pro);
	//子弹攻击力
	this.ATK = Pro.ATK;
	//子弹代号
	this.code = Pro.code;
	//子弹轨迹
	this.track = Pro.track;
	//子弹目标
	this.target = Pro.target;
}

//1号子弹类工厂
var Shell_1 = function(x,y){
	var Pro = new Object;
	//重写部分属性
	//生成坐标
	Pro.x = x;
	Pro.y = y;
	//生成大小
	Pro.width = 27;
	Pro.height = 40;
	//加载图片
	Pro.imgObj = coverageImage;
	Pro.px = 0;
	Pro.py = 64;
	Pro.pwidth = 40;
	Pro.pheight = 56;
	//子弹攻击力
	Pro.ATK = 1;
	//子弹代号
	Pro.code = 1;
	//子弹轨迹
	Pro.track = function(){
		this.y -= 13;
	};
	//子弹是否已经触发碰撞
	Pro.isint = false;
	//子弹目标
	Pro.target = null;
	Pro.onUpdata = function(){
		this.track();
		//创建一个子弹火光
		//销毁子弹
		if(this.y+this.height/2<0){
			this.remove();
		}
	}
	return (new Shell(Pro));
}

//子弹碰撞敌机火光工厂（不加入渲染序列）
var Flame = function(x,y){
	var Pro = new Object;
	//生成坐标
	Pro.x = x;
	Pro.y = y;
	//生成大小
	Pro.width = 40;
	Pro.height = 40;
	//加载图片
	Pro.imgObj = coverageImage;
	Pro.px = 0;
	Pro.py = 196;
	Pro.pwidth = 64;
	Pro.pheight = 64;
	//当前存在的帧数
	Pro.z = 5;
	Pro.onUpdata = function(){
		if(Pro.z==0){
			this.remove();
		}
		Pro.z--;
	}
	GRbit.onlySpititList.push(new GRbit.ImgSpitit(Pro));
}
//飞机死亡爆炸工厂（不加入渲染序列）
var Explode = function(x,y){
	var Pro = new Object;
	//生成坐标
	Pro.x = x;
	Pro.y = y;
	//生成大小
	Pro.width = 40;
	Pro.height = 40;
	//加载图片
	Pro.imgObj = coverageImage;
	Pro.px = 0;
	Pro.py = 132;
	Pro.pwidth = 64;
	Pro.pheight = 64;
	//总共存在的切换帧的个数
	Pro.k = 5;
	//当前存在的切换帧的个数
	Pro.i = 0;
	Pro.onUpdata = function(){
		//每隔3帧切换一个画面
		if(GRbit.$roll%5==0){
			this.px += 64;
		}
		if(this.i>this.k){
			this.remove();
		}
		this.i++;
	}
	GRbit.onlySpititList.push(new GRbit.ImgSpitit(Pro));
}
//生成1号绿色敌机序列
var Enemy_1 = function(){
	for(let i=1;i<5;i++){
		var enemy = new Aircraft({
			x:i*65,
			y:i*-30,
			vy:4,
			HP:2,
			imgObj:coverageImage,
			width:50,
			height:40,
			px:41,
			py:64,
			pwidth:60,
			pheight:60,
			defaultList:[
				//飞机回执
				[function(thit){
					if(thit.y>stage.height*4/5){
						return true;
					}
				},
				function(thit){
					thit.px = 101;
					thit.vy = -1;
				}],
				//飞机进行形变
				[function(thit){
					if(thit.vy == -1&&GRbit.$roll%15==0){
						return true;
					}
				},
				function(thit){
					thit.px = 161;
					thit.vy = -2;
				}],
				[function(thit){
					if(thit.vy == -2 &&GRbit.$roll%15==0){
						return true;
					}
				},
				function(thit){
					thit.px = 221;
					thit.vy = -3;
				}],
				//走出页面销毁
				[function(thit){
					if(thit.y<0-thit.height){
						return true;
					}
				},
				function(thit){
					thit.remove();
				}],
				
			],
			onUpdata:function(){
				//死亡
				if(this.HP<=0){
					this.remove();
					Explode(this.x,this.y);
				}
				if(GRbit.$roll%5==0){
					if(this.x-aircraft.x<0){
						this.x++;
					}else{
						this.x--;
					}
				}
				this.y += this.vy;
			}
		})
		GRbit.spititList.push(enemy);
			GRbit.ArcadeCrash.addCrash(enemy,"enemy",{
			"aircraft":function(){
				return 1;
			}
		});
	}
}
//生成2号红色敌机序列
var Enemy_2 = function(){
	for(let i=1;i<5;i++){
		var enemy = new Aircraft({
			x:-(i*65),
			y:80,
			vy:0,
			vx:3,
			HP:1,
			imgObj:coverageImage,
			width:40,
			height:30,
			px:281,
			py:64,
			rotate:-90,
			pwidth:60,
			pheight:60,
			defaultList:[
				[function(thit){
					return thit.x>stage.width*1/2;
				},
				function(thit){
					thit.$rotate = -45;
					thit.vy = 1;
					thit.vx = 2;
				}],
				[function(thit){
					return thit.y > 120;
				},
				function(thit){
					thit.$rotate = 0;
					thit.vx = 0;
					thit.vy = 2;
				}],
				[function(thit){
					return thit.y > 200;
				},
				function(thit){
					thit.vy = 3;
					if(thit.x-aircraft.x<0){
						thit.vx++;
					}else{
						thit.vx--;
					}
				}],
				//走出页面销毁
				[function(thit){
					if(thit.y<0-thit.height){
						return true;
					}
				},
				function(thit){
					thit.remove();
				}],
				
			],
			onUpdata:function(){
				//死亡
				if(this.HP<=0){
					this.remove();
					Explode(this.x,this.y);
				}
				this.y += this.vy;
				this.x += this.vx;
			}
		})
		GRbit.spititList.push(enemy);
			GRbit.ArcadeCrash.addCrash(enemy,"enemy",{
			"aircraft":function(){
				return 1;
			}
		});
	}
}
