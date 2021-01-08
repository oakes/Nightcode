package {{package}};

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import org.lwjgl.input.Keyboard;

public class {{desktop-class-name}} {
	public static void main (String[] args) {
		LwjglApplicationConfiguration cfg =
			new LwjglApplicationConfiguration();
		cfg.title = "{{app-name}}";
		cfg.width = 800;
		cfg.height = 600;
		cfg.vSyncEnabled = true;
		new LwjglApplication(new {{class-name}}(), cfg);
		Keyboard.enableRepeatEvents(true);
	}
}
