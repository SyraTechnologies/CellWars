function CellAI(team){
	var self = this;
	this.currCell = null;
	this.closestcell = null;
	this.ccd = 5000;
	this.ccs = 200;
	this.lc = null;
	this.lcd = 0;
	this.lastcell = null;
	this._update = function(){
		self.lastcell = self.closestcell;
		self.closestcell = null;
		self.closestcell = this._getclosestcell();
		
		if(self.closestcell && self.currCell){
			if(self.currCell.team == self.team && self.closestcell != self.currCell){
				if(self.currCell.size.x > 10){
					window.SP._addFood(self.currCell,self.closestcell,10);
					self.currCell.setBodyScale(((1/100) * (self.currCell.size.x - 10)),((1/100) * (self.currCell.size.y - 10)))
				}
			}
			self.currCell = null;
		}
	};
	this._getlargestcell = function(){
		self.lc = null;
		self.lcd = 0;
		for(var i in window.SP.cells){
			var cell = window.SP.cells[i];
			if(cell.team == self.team && self.lcd < cell.size.x){
				self.lc = cell;
				self.lcd = cell.size.x;
			}
		}
		return self.lc;
	};
	this._getclosestcell = function(){
		self.currCell = self._getlargestcell();
		self.ccs = 200;
		self.ccd = 5000;
		if(self.currCell){
			for(var i in window.SP.cells){
				var cell = window.SP.cells[i];
				var x = (cell.x - self.currCell.x );
				var y = (cell.y - self.currCell.y );
				var distance = Math.sqrt(x*x+y*y);
				if(cell != self.currCell && self.ccd > distance && cell.team != self.team && cell != self.lastcell){
					self.ccd = distance;
					self.ccs = cell.size.x;
					self.closestcell = cell;
				}
			}
		}
		return self.closestcell;
	};
	this.team = team;
}