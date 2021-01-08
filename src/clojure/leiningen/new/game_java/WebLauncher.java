package {{package}};

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.backends.gwt.GwtApplication;
import com.badlogic.gdx.backends.gwt.GwtApplicationConfiguration;

public class {{web-class-name}} extends GwtApplication {

	public GwtApplicationConfiguration getConfig () {
		return new GwtApplicationConfiguration(800, 600);
	}

	public ApplicationListener createApplicationListener () {
		return new {{class-name}}();
	}
}
