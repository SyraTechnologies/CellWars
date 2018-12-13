function SinglePlayer(){
	var self = this;
	self.AITickLast = 0;
	self.AITickCurr = 0;
	self.selectedCells = [];
	self.lastClick = new Date().getTime() / 1000;
	self.lastHB = new Date().getTime() / 1000;
	self.currentHB = new Date().getTime() / 1000;
	self.cells = [];
	self.food=[];
	self.AIs = [];


}

SinglePlayer.prototype._foodTick = function(){
	var self = this;
	for(var l in self.food){
		if(self.food[l]){
			if(self.food[l].active){
				//set the bullets velocity in the correct direction.
				var angle = Math.atan2(self.food[l].x - self.food[l].destCell.x,self.food[l].y - self.food[l].destCell.y);
				
				var xV = -100*Math.cos(angle);
				var yV = -100*Math.sin(angle);
				self.food[l].setVelocity(yV ,xV);
			}else{
				delete self.food[l];
			}
		}else{
			self.food.splice(l,1);
		}
	}
};

SinglePlayer.prototype._aiTick = function(){
	var self = this;
	self.AITickCurr = new Date();
	if(self.AITickCurr - self.AITickLast > aidiff){
		self.AITickLast = self.AITickCurr;
		for(var l in self.AIs){//Iterate through AIs
			var ai = self.AIs[l];
			ai._update(); //Make a move as AI
		}
	}
};
SinglePlayer.prototype._tick = function(){
	var self = this;
	
	
	
	this._foodTick(); //Update bullet directions.
	this._aiTick(); //Make next AI move)
	
	
	//Grow the cells every second.
	self.currentHB=new Date().getTime() / 1000;
	if(self.currentHB-self.lastHB > 1){
		for(var i in self.cells){
			if(self.cells[i].size.x < 150 && self.cells[i].team != "gray" && currScene != "TitleScene" && currScene != "BDScene" && currScene != "WinScene" && currScene != "CTScene")
				self.cells[i].setBodyScale((1/100) * (self.cells[i].size.x+5) ,(1/100) * (self.cells[i].size.y+5))
		}
		self.lastHB = self.currentHB;
	}

	if(currScene == "1"){
		
		var lastTeam = "";
		var won = true;
		for(var i in self.cells){
			if(lastTeam == "")
				lastTeam = self.cells[i].team;
			if(self.cells[i].team != lastTeam){
				won = false;
			}
			
		}
		for(var i in food){
			if(lastTeam == "")
				lastTeam = food[i].team;
			if(food[i].team != lastTeam){
				won = false;
			}
			
		}
		if(won){
			won = false;
			winner = lastTeam;
			currScene = "WinScene";
			scene.scene.start('WinScene');
		}
		
	}else if(currScene == "WinScene"){
		var B = false;
		var R = false;
		for(var i in self.cells){
			if(self.cells[i].team == "blue")
				B = true;
			if(self.cells[i].team == "red")
				R = true;
		}
		if(!B){
			currScene = "BDScene";
			scene.scene.start('BDScene');
		}
		if(!R){
			currScene = "TitleScene";
			scene.scene.start('TitleScene');
		}
	}else if(currScene == "BDScene"){
		var G = false;
		var R = false;
		var B = false;
		for(var i in self.cells){
			if(self.cells[i].team == "green")
				G = true;
			else if(self.cells[i].team == "blue")
				B = true;
			else if(self.cells[i].team == "red")
				R = true;
		}
		if(!G)
			aidiff = 300;
		if(!R)
			aidiff = 1200;
		if(!B)
			aidiff = 600;
		if(!G || !R || !B){
			currScene = "CTScene";
			scene.scene.start('CTScene');
		}
	}else if(currScene == "CTScene"){
		var G = false;
		var R = false;
		var B = false;
		for(var i in self.cells){
			if(self.cells[i].team == "green")
				G = true;
			if(self.cells[i].team == "blue")
				B = true;
			if(self.cells[i].team == "red")
				R = true;
		}
		if(!G)
			currTeam = "green";
		if(!R)
			currTeam = "red";
		if(!B)
			currTeam = "blue";
		if(!G || !R || !B){
			currScene = "1";
			scene.scene.start('SoloScene');
		}
	}else if(currScene == "TitleScene"){
		var G = false;
		var B = false;
		for(var i in self.cells){
			if(self.cells[i].team == "green")
				G = true;
			if(self.cells[i].team == "blue")
				B = true;
		}
		if(!G && self.cells){
			self.selectedCells = [];
			food = [];
			currScene = "BDScene";
			scene.scene.start('BDScene');
		}
		if(!B && self.cells){
			currScene = "MultiScene";
			scene.scene.start('MultiScene');
		}
	}
};
SinglePlayer.prototype._addFood = function (start,target,size){
	var self = this;
	if(start && target){
		var l = self.food.length;
		var f = false;
		var angle = Math.atan2(start.y - target.y,start.x - target.x);
		var xV = Math.cos(angle);
		var yV = Math.sin(angle);
		self.food[l] = scene.impact.add.image(start.x+50+(-1*xV*start.size.x/1),start.y+(50)+(-1*yV*start.size.y/1), 'cell-food');
		self.food[l].ownerCell = start;
		self.food[l].destCell = target;
		self.food[l].team = start.team;
		self.food[l].setTypeA().setCheckAgainstB().setActiveCollision();
		self.food[l].setCollideCallback((a,b,axis)=>{
			if(a.gameObject && b.gameObject){
				if(a.gameObject.team != b.gameObject.team){
					var s = Math.abs((1/100) * (a.size.x - b.size.x));
					if(a.size.x > b.size.x || Math.abs(a.size.x - b.size.x) < 20){
						//a larger
						b.gameObject.team = a.gameObject.team;
						if(!b.gameObject.ownerCell)
							b.gameObject.setTexture("cell-"+a.gameObject.team,0);
						
					}
					b.gameObject.setBodyScale(s,s);	
					a.gameObject.destroy();
					
				}else{
					if(b.size.x < 150){
						b.gameObject.setBodyScale((1/100) * (b.size.x + a.size.x),(1/100) * (b.size.y + a.size.y));
						a.gameObject.destroy();
						
					}
				}
			}
		}, scene);
		self.food[l].setBodyScale((1/100) * size,(1/100) * size);
	}
};
SinglePlayer.prototype._addCell = function(x,y,team,size){
	var self = this;
	var l = self.cells.length;
	self.cells[l] = scene.impact.add.image((sceneWidth/100)*x,(sceneHeight/100)*y, 'cell-'+team);
	self.cells[l].team = team;
	self.cells[l].setBodyScale((1/100) * (sceneWidth/100*size),(1/100) * (sceneWidth/100*size));
	self.cells[l].setTypeB().setCheckAgainstA().setFixedCollision();
	return self.cells[l];
}
SinglePlayer.prototype.LoadMap = function (id,fad,ais)
{
	
	var self = this;
	function isInside(x1,y1,x2,y2,size){
		if(Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1) * (y2-y1)))< size){
			return true;
		}else{
			return false;
		}
	}
	var self = this;
	self.cells = [];
	self.food = [];
	var maps = {
		"TitleScene": [
			{x: 40, y: 50, team: 'gray',size: 30},
			{x: 15, y: 10, team: 'green',size: 25},
			{x: 80,y: 10, team: 'blue',size: 25}
		],
		"CTScene": [
			{x: 15, y: 10, team: 'red',size: 10},
			{x: 90,y: 10, team: 'green',size: 10},
			{x: 50, y: 10, team: 'blue',size: 10},
			{x: 50, y: 50, team: 'gray',size: 30}
		],
		"WinScene":[{x: 85, y: 30, team: 'red',size: 15},
			{x: 15, y: 30, team: 'blue',size: 15},
			{x: 46,y: 80, team: 'gray',size: 30}],
		"1": [
			{x: 15, y: 10, team: 'green',size: 15}
			,{x: 80,y: 10, team: 'gray',size: 10}
			,{x: 46, y: 10, team: 'gray',size: 10}
			,{x: 46, y: 90, team: 'gray',size: 10}
			,{x: 15, y: 50, team: 'gray',size: 15}
			,{x: 46, y: 50, team: 'gray',size: 10}
			,{x: 80, y: 50, team: 'blue',size: 10}
			,{x: 15, y: 90, team: 'red',size: 15}
			,{x: 80, y: 90, team: 'gray',size: 10}
		],
		"MultiScene": []
		};
		
	
	for(var i2 in maps[id]){
		self._addCell(maps[id][i2].x,maps[id][i2].y,maps[id][i2].team,maps[id][i2].size);
	}
	for(var i in ais){
		if(!self.AIs)
			self.AIs = [];
		self.AIs[self.AIs.length] = new CellAI(ais[i]);
	}
	scene.input.keyboard.on('keyup', function (event) {
		if(event.key == "Shift")
			window.ShiftKey = null
	});
	scene.input.keyboard.on('keydown', function (event) {
		if(event.key == "Shift")
			window.ShiftKey = true;
	});
	scene.input.on('pointerup', function (pointer) {
		if (pointer.rightButtonDown())
        {
			for(var i in self.cells){
				if( isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,self.cells[i].size.x)){
					var f = false;
					for(var i2 in self.selectedCells){
						
						if(self.selectedCells[i2] == self.cells[i]){
							delete self.selectedCells[i2];
							f = true;
						}
					}
					if(!window.ShiftKey && self.cells[i].team == currTeam )
						self.selectedCells.splice(0,self.selectedCells.length);
					if(self.cells[i].team == currTeam && !f){
						self.selectedCells[self.selectedCells.length] = self.cells[i];
					}
				}
					
			}
        }
        else
        {
			var m = (pointer.upTime - pointer.downTime)/150;
			if(m < 1)
				m = 1;
			if((pointer.upTime - pointer.downTime)/1000 < 0.5){
				for(var i in self.cells){
					var v = self.cells[i].size.x*1;
					if(self.cells[i].size.x < 30){
					v = 100;
					}
					if(isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,v)){
						for(var i2 in self.selectedCells){
							var selectedCell = self.selectedCells[i2];
							if(selectedCell.team == currTeam){
								var s = selectedCell.size.x*0.10*m;
								if(s < 10)
									s = 10;
								if(selectedCell.size.x > s){
									self._addFood(selectedCell,self.cells[i],s);
									selectedCell.setBodyScale((1/100) * (selectedCell.size.x - (s)),(1/100) * (selectedCell.size.y - (s)))
								}
							}else{
								delete self.selectedCells[i2];
							}
						}
					}
				}
			}
			var currentTime = new Date().getTime() / 1000;
			if((pointer.upTime - pointer.downTime)/1000 > 0.5){
				for(var i in self.cells){
					var v = self.cells[i].size.x;
					if(self.cells[i].size.x < 30){
					v = 100;
					}
					if(self.cells[i].team == currTeam  && isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,self.cells[i].size.x)){
					var f = false;
					for(var i2 in self.selectedCells){
						if(self.selectedCells[i2] == self.cells[i]){
							delete self.selectedCells[i2];
							f = true;
						}
					}						
					if(!f)
						self.selectedCells[self.selectedCells.length] = self.cells[i];
					}
				}
			}
			
			self.lastClick = currentTime;
			
        }
		
		for(var i in self.cells){
			self.cells[i].setTexture("cell-"+self.cells[i].team);
		}
		for(var i in self.selectedCells){
			self.selectedCells[i].setTexture("cell-"+self.selectedCells[i].team+"-selected");
		}
    }, self);
}
