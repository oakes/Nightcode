package {{package-name}};

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL10;

public class {{class-name}} implements ApplicationListener {
	public void create () {
	}

	public void render () {
		Gdx.gl.glClearColor(0, 0, 0, 0);
		Gdx.gl.glClear(GL10.GL_COLOR_BUFFER_BIT);
	}

	public void resize (int width, int height) {
	}

	public void pause () {
	}

	public void resume () {
	}

	public void dispose () {
	}
}
