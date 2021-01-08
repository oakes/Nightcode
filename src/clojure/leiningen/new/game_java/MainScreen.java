package {{package}};

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;

public class {{screen-class-name}} implements Screen {
	Stage stage;
	
	public void show() {
		stage = new Stage();
		Color color = new Color(1, 1, 1, 1);
		Label.LabelStyle style = new Label.LabelStyle(new BitmapFont(), color);
		stage.addActor(new Label("Hello world!", style));
	}
	
	public void render(float delta) {
		Gdx.gl.glClearColor(0, 0, 0, 0);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		
		stage.act(delta);
		stage.draw();
	}
	
	public void dispose() {
	}
	
	public void hide() {
	}
	
	public void pause() {
	}

	public void resize(int width, int height) {
	}

	public void resume() {
	}
}
