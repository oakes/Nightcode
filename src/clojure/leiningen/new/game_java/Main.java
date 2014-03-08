package {{package}};

import com.badlogic.gdx.Game;
import com.badlogic.gdx.graphics.Texture;

public class {{class-name}} extends Game {
	public void create() {
		Texture.setEnforcePotImages(false);
		this.setScreen(new {{screen-class-name}}());
	}
}
