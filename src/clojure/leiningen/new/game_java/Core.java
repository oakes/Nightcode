package {{package}};

import com.badlogic.gdx.Game;

public class Core extends Game {
	public void create() {
		this.setScreen(new MainScreen());
	}
}
