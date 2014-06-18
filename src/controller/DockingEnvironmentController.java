package controller;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.vertx.java.core.Vertx;

import vo.DockingEnvironmentVO;
import vo.JoinedMemberVO;
import vo.MemberVO;
import SocketIO.SocketIO;
import controller.action.AddAction;
import controller.action.SearchAction;

public class DockingEnvironmentController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void dockingEnvironmentAdd() throws ServletException, IOException
	{	
		//..................
	}

	public void dockingEnvironmentModify() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentSearch() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentSearchAll() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentDelete() throws ServletException, IOException
	{

	}
}
