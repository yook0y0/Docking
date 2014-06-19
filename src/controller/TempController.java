package controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TempController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void tempAdd() throws ServletException, IOException
	{

	}

	public void tempModify() throws ServletException, IOException
	{

	}

	public void tempSearch() throws ServletException, IOException
	{

	}

	public void tempSearchAll() throws ServletException, IOException
	{

	}

	public void tempDelete() throws ServletException, IOException
	{

	}
}
