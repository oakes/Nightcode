package {{package}};

import com.badlogic.gdx.backends.android.AndroidApplication;

public class {{android-class-name}} extends AndroidApplication {
	public void onCreate (android.os.Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		initialize(new {{class-name}}());
	}
}
