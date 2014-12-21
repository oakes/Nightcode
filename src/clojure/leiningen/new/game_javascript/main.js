var state = {
	init: function() {
		// Create simple text display for current Phaser version
		var text = "Phaser Version " + Phaser.VERSION + " works!";
		var style = { font: "24px Arial", fill: "#fff", align: "center" };
		var t = game.add.text(this.world.centerX, this.world.centerY, text, style);
		t.anchor.setTo(0.5, 0.5);
	},
	preload: function() {
		// State preload logic goes here
	},
	create: function() {
		// State create logic goes here
	},
	update: function() {
		// State update logic goes here
	}
};

var game = new Phaser.Game(
	"100",
	"100",
	Phaser.AUTO,
	'game',
	state
);
