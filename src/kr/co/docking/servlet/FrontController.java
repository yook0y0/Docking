package kr.co.docking.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.co.docking.controller.MemberController;
import kr.co.docking.util.Injector;

@WebServlet(name="/FrontController", urlPatterns={
		"/member_add", "/member_modify", "/member_search", "/member_delete"
})
public class FrontController extends HttpServlet 
{
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException 
	{

	}

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException 
	{
		process(req,res);
	}
	
	private void process(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
	{
		req.setCharacterEncoding("UTF-8");
		String	uri = req.getRequestURI();
		int		lastIndex = uri.lastIndexOf("/");
		String	action = uri.substring(lastIndex + 1);

		req.setCharacterEncoding("utf-8");


		if(action.equals("member_add"))
		{
			MemberController	memberController = (MemberController)Injector.getInstance().getObject(MemberController.class);
			memberController.setReq(req);
			memberController.setRes(res);
			memberController.memberCreate();
		}
		else if(action.equals("member_search"))
		{
			MemberController	memberController = (MemberController)Injector.getInstance().getObject(MemberController.class);
			memberController.setReq(req);
			memberController.setRes(res);
			memberController.memberRead();
		}
	}
}
