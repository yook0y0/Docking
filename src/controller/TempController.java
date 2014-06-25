package controller;

import java.io.IOException;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import socketIO.SocketIO;
import util.Injector;
import vo.TempVO;
import controller.action.AddAction;
import controller.action.SearchAction;

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
		String	docId = req.getParameter("docId");
		String	backUpData = req.getParameter("data");
		
		long 	time = System.currentTimeMillis();

        Date 	date = new Date(time);
        SimpleDateFormat 	df2 = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String 	dateText = df2.format(date);
        
		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		
		TempVO	tempVO = new TempVO();
		
		tempVO.setBuDate(dateText);
		tempVO.setDocId(docId);
		tempVO.setBackUpData(backUpData);
		
		addAction.addTemp(tempVO);
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		List<TempVO>	tempList = searchAction.searchTempByDocId(docId);
		
		int	lastDate = 0;

		if(tempList.size() != 0)
		{
			lastDate = tempList.get(0).getCheckLast();
			
			for(TempVO vo : tempList)
			{
				if(vo.getCheckLast() >= lastDate)
				{
					lastDate = vo.getCheckLast();
				}
			}
		}
		
		res.setCharacterEncoding("utf-8");
		res.getWriter().println(docId + "|" + lastDate + "|" + tempVO.getBuDate());
		res.getWriter().flush();
	}

	public void tempModify() throws ServletException, IOException
	{

	}

	public void tempSearch() throws ServletException, IOException
	{
		
	}

	public void tempSearchAll() throws ServletException, IOException
	{
		String	docId = req.getParameter("docId");
		String	lastDate = req.getParameter("lastDate");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		List<TempVO>	tempList = searchAction.searchTempByDocId(docId);
		
		String	buData = null;
		
		for(TempVO vo : tempList)
		{
			if(vo.getCheckLast() == Integer.parseInt(lastDate))
			{
				buData = vo.getBackUpData();
			}
		}
		
		SocketIO.setBackUpData(buData);
		
		res.sendRedirect("startSocket?docId=" + docId + "&lastDate=" + lastDate);
	}

	public void tempDelete() throws ServletException, IOException
	{

	}
}
