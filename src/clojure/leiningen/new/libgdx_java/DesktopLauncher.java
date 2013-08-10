package {{package-name}};

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;

public class DesktopLauncher {
	public static void main (String[] args) {
		LwjglApplicationConfiguration cfg =
			new LwjglApplicationConfiguration();
		cfg.title = "{{raw-name}}";
		cfg.useGL20 = true;
		cfg.width = 800;
		cfg.height = 600;
		//cfg.useCPUSynch = false;
		cfg.vSyncEnabled = true;
		new LwjglApplication(new {{class-name}}(), cfg);
	}
}
