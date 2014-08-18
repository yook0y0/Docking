package org.docking.erbse.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.docking.erbse.socket.SocketServer;
import org.vertx.java.core.Vertx;

@WebListener
public class DockingServletContextListener  implements ServletContextListener
{
	@Override
	public void contextInitialized(ServletContextEvent event) 
	{
		SocketServer sio = new SocketServer();
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
