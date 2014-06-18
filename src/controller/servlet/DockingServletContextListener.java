package controller.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import SocketIO.SocketIO;

@WebListener
public class DockingServletContextListener  implements ServletContextListener
{
	@Override
	public void contextInitialized(ServletContextEvent event) 
	{
		event.getServletContext().setAttribute("socketIO", new SocketIO());
		
		System.out.println("ServletContextListener Start");
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) 
	{	
		System.out.println("ServletContextListener End");
	}
}
