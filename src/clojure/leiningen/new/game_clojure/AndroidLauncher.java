package {{package}};

import clojure.lang.RT;
import clojure.lang.Symbol;

import com.badlogic.gdx.backends.android.AndroidApplication;
import com.badlogic.gdx.Game;

public class {{android-class-name}} extends AndroidApplication {
	public void onCreate (android.os.Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
          RT.var("clojure.core", "require").invoke(Symbol.intern("{{namespace}}"));
		try {
			Game game = (Game) RT.var("{{namespace}}", "{{app-name}}").deref();
			initialize(game, true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
