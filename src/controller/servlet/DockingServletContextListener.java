package controller.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.vertx.java.core.Vertx;

import socketIO.SocketIO;


@WebListener
public class DockingServletContextListener  implements ServletContextListener
{
	@Override
	public void contextInitialized(ServletContextEvent event) 
	{
		SocketIO sio = new SocketIO();
		sio.setPort(9000);
		sio.start(Vertx.newVertx());
		event.getServletContext().setAttribute("socketIO", sio);
		
		System.out.println("ServletContextListener Start");
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) 
	{	
		System.out.println("ServletContextListener End");
	}
}
