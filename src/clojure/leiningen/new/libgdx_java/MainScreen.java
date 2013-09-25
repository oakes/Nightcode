package {{package}};

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Graphics;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;

public class MainScreen implements Screen {
	private Stage stage;
	
	public void show() {
		stage = new Stage();
		Color color = new Color(1, 1, 1, 1);
		Label.LabelStyle style = new Label.LabelStyle(new BitmapFont(), color);
		stage.addActor(new Label("Hello world!", style));
	}
	
	public void render(float delta) {
		Gdx.gl.glClearColor(0f, 0f, 0f, 1f);
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
