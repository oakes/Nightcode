package {{package-name}};

import com.badlogic.gdx.backends.android.AndroidApplication;
import org.mini2Dx.core.game.Mini2DxGame;

public class AndroidLauncher extends AndroidApplication {
	public void onCreate (android.os.Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		initialize(new Mini2DxGame(new {{class-name}}()), false);
	}
}
