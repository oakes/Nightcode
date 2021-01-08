package nightcode;

import java.awt.*;
import java.lang.reflect.Method;
import java.util.Properties;
import javax.swing.*;

/**
 * This class handles loading of Nightcode namespaces while the splash image
 * is displayed on the screen. See entry point main() method in this class. How
 * it works:
 * 0. Opens splash screen in a JWindow if it wasn't loaded via awt
 * 1. Loads nightcode.core/-main using reflection (it takes time)
 * 2. Closes splash screen
 * 3. Invokes nightcode.core/-main
 */
public class Nightcode {

    private Method loadNightcodeMain() throws Exception {
        final String cn = "nightcode.core";
        Class<?> clazz = Class.forName(cn);
        if (clazz == null) {
            throw new RuntimeException("Cannot load class " + cn);
        }
        Method m = clazz.getMethod("main", String[].class);
        if (m == null) {
            throw new RuntimeException("Cannot obtain method 'main'");
        }
        return m;
    }

    private void invokeNightcodeMain(Method m, String[] args) throws Exception {
        m.invoke(null, (Object) args);
    }

    private void init(String[] args) throws Exception {
        final SplashScreen splash = SplashScreen.getSplashScreen();
        Method m;

        if (splash == null) {
            JWindow window = new JWindow();
            ClassLoader cl = this.getClass().getClassLoader();
            Icon icon  = new ImageIcon(cl.getResource("images/logo_splash.png"));
            window.add(new JLabel(icon));
            window.setSize(icon.getIconWidth(), icon.getIconHeight());
            window.setLocationRelativeTo(null);
            window.setVisible(true);
            m = loadNightcodeMain();
            window.setVisible(false);
            window.dispose();
        } else {
            m = loadNightcodeMain();
            splash.close();
        }

        invokeNightcodeMain(m, args);
    }

    public static void main(String[] args) throws Exception {
        Properties props = System.getProperties();
        // properties to make font rendering smoother on Linux+OracleJVM/OpenJDK
        // should make no difference on other OSes and JVMs
        // set properties only if the user has not overidden them
        if (props.getProperty("awt.useSystemAAFontSettings") == null
                && props.getProperty("sun.java2d.xrender") == null) {
            props.setProperty("awt.useSystemAAFontSettings", "on");
            props.setProperty("sun.java2d.xrender", "true");
        }
        // initialize and launch Nightcode
        new Nightcode().init(args);
    }

}
