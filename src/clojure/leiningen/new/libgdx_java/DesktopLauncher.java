package {{package-name}};

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;

public class DesktopLauncher {
	public static void main (String[] args) {
		new LwjglApplication(
			new {{class-name}}(),
			"{{class-name}}",
			800,
			480,
			false
		);
	}
}
