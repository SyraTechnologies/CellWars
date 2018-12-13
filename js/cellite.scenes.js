var AITickLast = 0;
var AITickCurr = 0;


function sceneTick()
{
	if(window.SP)
		window.SP._tick();
	if(window.MP)
		window.MP._tick();
}
var BDScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BDScene ()
    {
        Phaser.Scene.call(this, { key: 'BDScene' });
    },

    preload: function ()
    {
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');
		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png');  
    },

    create: function ()
    {
		scene = this;
		window.SP = new SinglePlayer();
		SP.LoadMap("CTScene",this);
		for(var i in SP.cells){
			if(SP.cells[i].team == "gray")
				SP.selectedCells[SP.selectedCells.length] = SP.cells[i];
		}
		for(var i in SP.selectedCells){
			SP.selectedCells[i].setTexture("cell-"+SP.selectedCells[i].team+"-selected");
		}
		
		var green = this.add.text(150, 00, 'Choose difficulty', { fontFamily: 'Arial', fontSize: 60, color: '#00ff00' });

	},
	update: sceneTick
});
var CTScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function CTScene ()
    {
        Phaser.Scene.call(this, { key: 'CTScene' });
    },

    preload: function ()
    {
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');
		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png');  
    },

    create: function ()
    {
		scene = this;
		window.SP = new SinglePlayer();
		SP.LoadMap("CTScene",this);
		for(var i in SP.cells){
			if(SP.cells[i].team == "gray")
				SP.selectedCells[SP.selectedCells.length] = SP.cells[i];
		}
		for(var i in SP.selectedCells){
			SP.selectedCells[i].setTexture("cell-"+SP.selectedCells[i].team+"-selected");
		}
		redai = null;
		greenai = null;
		var green = this.add.text(150, 00, 'Choose your color', { fontFamily: 'Arial', fontSize: 60, color: '#00ff00' });

	},
	update: sceneTick
});
var WinScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WinScene ()
    {
        Phaser.Scene.call(this, { key: 'WinScene' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
		scene = this;
		window.SP = new SinglePlayer();
		SP.LoadMap(currScene,this);
		console.log(window.winner,window.currTeam);
		if(window.currTeam == window.winner){
			this.add.text(300, 00, 'Congratulations!', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
			this.add.text(330, 55, 'YOU WON!', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
			this.add.text(10, 725, 'Replay', { fontFamily: 'Arial', fontSize: 60, color: '#0000ff' });
			this.add.text(600, 725, 'Main Menu', { fontFamily: 'Arial', fontSize: 60, color: '#ff0000' });
		}else{
			this.add.text(330, 00, 'WHOOPS!', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
			this.add.text(330, 55, 'YOU LOST!', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
			this.add.text(10, 725, 'Replay', { fontFamily: 'Arial', fontSize: 60, color: '#0000ff' });
			this.add.text(600, 725, 'Main Menu', { fontFamily: 'Arial', fontSize: 60, color: '#ff0000' });
		}
		currTeam = "gray";
		
	},
	update: sceneTick
});

var TitleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function TitleScene ()
    {
        Phaser.Scene.call(this, { key: 'TitleScene' });
    },

    preload: function ()
    {
		var noop = function(m){console.log(m);};
		this.game.registry.events._events.blur = [];
		this.game.registry.events._events.focus = [];
		this.game.registry.events._events.hidden = [];
		this.game.onBlur = ()=>noop("blur");
		this.game.onFocus = ()=>noop("focus");
		this.game.onPause = ()=>noop("pause");
		this.focusLoss = ()=>noop("focusloss");
		this.focusGain = ()=>noop("focusgain");
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');
		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png');  
    },

    create: function ()
    {
		scene = this;

		window.SP = new SinglePlayer();
		SP.LoadMap("TitleScene",this);
		currTeam = "gray";
		for(var i in SP.cells){
			if(SP.cells[i].team == "gray")
				SP.selectedCells[SP.selectedCells.length] = SP.cells[i];
		}
		for(var i in SP.selectedCells){
			SP.selectedCells[i].setTexture("cell-"+SP.selectedCells[i].team+"-selected");
		}
		var green = this.add.text(0, 00, 'Single Player', { fontFamily: 'Arial', fontSize: 60, color: '#00ff00' });
		var green = this.add.text(600, 0, 'Multiplayer', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });

	},
	update: sceneTick
});
var SoloScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SoloScene ()
    {
        Phaser.Scene.call(this, { key: 'SoloScene' });
    },

    preload: function ()
    {
		this.game.registry.events._events.blur = [];
		this.game.registry.events._events.focus = [];
		this.game.registry.events._events.hidden = [];
		this.game.onBlur = ()=>noop("blur");
		this.game.onFocus = ()=>noop("focus");
		this.game.onPause = ()=>noop("pause");
		this.focusLoss = ()=>noop("focusloss");
		this.focusGain = ()=>noop("focusgain");
		//this.stage.disableVisibilityChange = true;
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');

		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png'); 
    },
    create: function ()
    {

		window.SP = new SinglePlayer();
		scene = this;
		var bots = [];
		for(var i in teams){
			if(teams[i] != currTeam)
				bots[bots.length] = teams[i];
		}
		SP.LoadMap(currScene,this,bots);
	},
	update: sceneTick
});
var MultiScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MultiScene ()
    {
        Phaser.Scene.call(this, { key: 'MultiScene' });
    },

    preload: function ()
    {
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');

		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png'); 
    },
    create: function ()
    {
		scene = this;
		console.log("Multiplayer");
		var mp = new Multiplayer(socket);
		mp.FindLobby();
		window.loadingtext = this.add.text(0, 100, "Waiting for players", { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });

	},
	update: sceneTick
});
var MultiWinScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MultiWinScene ()
    {
        Phaser.Scene.call(this, { key: 'MultiWinScene' });
    },

    preload: function ()
    {
		this.load.image('cell-gray-selected', '/img/cell-gray-selected.png');
		this.load.image('cell-green-selected', '/img/cell-green-selected.png');

		this.load.image('cell-blue-selected', '/img/cell-blue-selected.png');
		this.load.image('cell-red-selected', '/img/cell-red-selected.png');
		this.load.image('cell-green', '/img/cell-green.png');
		this.load.image('cell-blue', '/img/cell-blue.png');
		this.load.image('cell-red', '/img/cell-red.png');
		this.load.image('cell-gray', '/img/cell-gray.png');
		this.load.image('cell-food', '/img/cell-food.png'); 
    },
    create: function ()
    {
		scene = this;
		this.add.text(0, 100, winner + " team wins", { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
		SP.LoadMap("CTScene",this);
		
	},
	update: sceneTick
});
