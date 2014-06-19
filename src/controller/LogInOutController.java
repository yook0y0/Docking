package controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import util.Injector;
import vo.MemberVO;
import controller.action.AddAction;
import controller.action.SearchAction;

public class LogInOutController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}
	
	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void login() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");
		String	pw = req.getParameter("memberPw");
		
		String	sendMessage = "LOGIN SUCCESS!";

		HttpSession	session = null;

		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		MemberVO	memberVO = searchAction.searchMember("member_search", id);

		if(memberVO != null)
		{
			if(memberVO.getPw().equals(pw))
			{
				session = req.getSession();

				session.setAttribute("logInMember", memberVO);
			}

			else
			{
				sendMessage = "LOGIN FAIL!";
			}
		}

		else
		{
			sendMessage = "LOGIN FAIL!";
		}

		res.setCharacterEncoding("utf-8");
		PrintWriter	writer = res.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}
	
	public void logout() throws ServletException, IOException
	{
		HttpSession hs = req.getSession();
		hs.removeAttribute("logInMember");
		res.sendRedirect("start.jsp");
	}
}
