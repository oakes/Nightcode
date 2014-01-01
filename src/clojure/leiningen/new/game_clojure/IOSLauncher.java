package {{package}};

import clojure.lang.RT;
import clojure.lang.Symbol;

import com.badlogic.gdx.backends.iosrobovm.IOSApplication;
import com.badlogic.gdx.backends.iosrobovm.IOSApplicationConfiguration;
import com.badlogic.gdx.Game;

import org.robovm.cocoatouch.foundation.NSAutoreleasePool;
import org.robovm.cocoatouch.uikit.UIApplication;

public class {{ios-class-name}} extends IOSApplication.Delegate {
	protected IOSApplication createApplication() {
		IOSApplicationConfiguration config = new IOSApplicationConfiguration();
          RT.var("clojure.core", "require").invoke(Symbol.intern("{{namespace}}"));
		try {
			Game game = (Game) RT.var("{{namespace}}", "{{app-name}}").deref();
			return new IOSApplication(game, config);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] argv) {
		NSAutoreleasePool pool = new NSAutoreleasePool();
		UIApplication.main(argv, null, {{ios-class-name}}.class);
		pool.drain();
	}
}
