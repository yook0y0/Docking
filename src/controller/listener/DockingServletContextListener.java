package controller.listener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import vo.JoinedMemberVO;
import vo.MemberVO;

@WebListener
public class DockingServletContextListener  implements ServletContextListener
{
	@Override
	public void contextInitialized(ServletContextEvent event) 
	{
		event.getServletContext().setAttribute("logInMemberList", new ArrayList<MemberVO>());
		event.getServletContext().setAttribute("joinedMember", new HashMap<String,List<JoinedMemberVO>>());
		
		System.out.println("ServletContextListener Start");
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) 
	{
		event.getServletContext().removeAttribute("logInMemberList");
		
		System.out.println("ServletContextListener End");
	}
}
