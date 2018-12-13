
function Multiplayer(socket){
	function isInside(x1,y1,x2,y2,size){
		if(Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1) * (y2-y1)))< size){
			return true;
		}else{
			return false;
		}
	}
	var self = this;
	this.socket = socket;
	this._callbacks = [];
	this.lobbyState = null; //WAITING, STARTED
	this.lastSocketId = "";
	this.interval = null;
	this.food = {};
	this.cells = {};
	this.map = false;
	this.lcid = 0;
	this.selectedCells = [];
	this.lfid = 0;
	this.socket.removeListener("hello");
	this.socket.removeListener("join lobby");
	this.socket.removeListener("cells");
	this.socket.removeListener("food");
	this.socket.on("hello",function(){
		if(self.lobby){
			self.socket.emit("rejoin lobby",self.lobby,self.lastSocketId);
		}
		self.lastSocketId = self.socket.id;
	});
	this.socket.on("join lobby",function(id,color){
		
		self.lobby = id;
		currTeam = color;
		var text = scene.add.text(250, 200,"Your color is " + color, { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
		text.z = 10000;
		setTimeout(()=>text.destroy(),3000);
	});
	this.socket.on("game over",function(winner){
		
		window.winner = winner;
		currScene = 'WinScene'; 
		scene.scene.start('WinScene');
	});
	this.socket.on("game state",function(state){
		self.state = state;
	});
	this.socket.on("cells",function(cells,id){
		if(self.state == "STARTED"){ //If we remove this we risk display information from the wrong match?
		if(window.loadingtext)
			window.loadingtext.destroy();
		if(self.cells){
		//{id: 0, x:0 ,y:s0, size:0 ,team:0,vX:0,vY:0}
		if(self.lcid != id){
			for(var i2 in cells){
				
				if(!self.cells[cells[i2].Id]){
					self._addCell(cells[i2].x,cells[i2].y,cells[i2].team,cells[i2].size,cells[i2].Id);
					self.cells[cells[i2].Id].id = cells[i2].Id;
				}else{
					self.cells[cells[i2].Id].scaleX = (1/100) * cells[i2].size;
					self.cells[cells[i2].Id].scaleY = (1/100) * cells[i2].size;
					self.cells[cells[i2].Id].id = cells[i2].Id;
					
					if(self.cells[cells[i2].Id].team != cells[i2].team){
						self.cells[cells[i2].Id].team = cells[i2].team;
						self.cells[cells[i2].Id].setTexture("cell-"+ cells[i2].team);

					}
				}
			}
		}
		}
		}
	});
	this.socket.on("food",function(food,id){
		if(self.state == "STARTED"){
		//{id: 0, x: 0, y: 0, size: 0, owner:"nobody", team: "gray"}
		if(self.lfid != id){
			var changed = [];
			for(var i2 in food){
				if(food[i2]){
					if(!self.food[food[i2].Id]){
						self._addFood(food[i2].x,food[i2].y,food[i2].size,food[i2].Id);
						var tween = scene.tweens.add({
							targets: self.food[food[i2].Id],
							x: food[i2].x,
							y: food[i2].y,
							duration: 1 * 500,
							yoyo: false,
							repeat: 0,
							loop: 0,
							onComplete: function() {
								tween = undefined;
							}
						});
						
					}else{
						var tween = scene.tweens.add({
							targets: self.food[food[i2].Id],
							x: food[i2].x,
							y: food[i2].y,
							duration: 1 * 500,
							yoyo: false,
							repeat: 0,
							loop: 0,
							onComplete: function() {
								tween = undefined;
							}
						});
						self.food[food[i2].Id].scaleX = (1/100) * food[i2].size;
						self.food[food[i2].Id].scaleY = (1/100) * food[i2].size;
					}
				}
			}
			
			for(var i in self.food){
				var found = false;
				for(var i2 in food){
					if(i == food[i2].Id){
						found = true;
					}
				}
				if(!found){
					self.food[i].destroy();
					found = undefined;
				}
			}
		}
		}
	});
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
				if( isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,self.cells[i].width)){
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
					f = undefined;
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
					var v = self.cells[i].width*1;
					if(self.cells[i].width < 30){
					v = 100;
					}
					if(isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,v)){
						for(var i2 in self.selectedCells){
							var selectedCell = self.selectedCells[i2];
							if(selectedCell.team == currTeam){
								var s = selectedCell.width*0.10*m;
								if(s < 20)
									s = 20;
								if(selectedCell.width > s && selectedCell != self.cells[i]){
									socket.emit('send food',selectedCell.id,i);
								}
							}else{
								delete self.selectedCells[i2];
							}
							selectedCell = undefined;
						}
					}
					v = undefined;
				}
			}
			var currentTime = new Date().getTime() / 1000;
			if((pointer.upTime - pointer.downTime)/1000 > 0.5){
				for(var i in self.cells){
					var v = self.cells[i].width;
					if(self.cells[i].width < 30){
					v = 100;
					}
					if(self.cells[i].team == currTeam  && isInside(pointer.worldX,pointer.worldY,self.cells[i].x,self.cells[i].y,v)){
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
					v = undefined;
					f = undefined;
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
Multiplayer.prototype.FindLobby = function(){
	console.log("Joining Queue");
	this.socket.emit("join queue");
};
Multiplayer.prototype._initScene = function(self){
	this.socket.emit("lobby state");
	
};
Multiplayer.prototype._tick = function (){
}
Multiplayer.prototype._addFood = function (x,y,size,id){
	var self = this;
	var f = false;
	self.food[id] = scene.add.sprite(x,y, 'cell-food');
	self.food[id].scaleX = (1/100) * size;
	self.food[id].scaleY = (1/100) * size;

};
Multiplayer.prototype._addCell = function(x,y,team,size,id){
	var self = this;
	self.cells[id] = scene.add.sprite(x,y, 'cell-'+team);
	self.cells[id].team = team;
	self.cells[id].setOrigin(0.5, 0.5);
	self.cells[id].scaleX = (1/100) * size;
	self.cells[id].scaleY = (1/100) * size;
	
	
	return self.cells[id];
}