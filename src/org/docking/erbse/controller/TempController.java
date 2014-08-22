package org.docking.erbse.controller;

import java.io.IOException;

import org.docking.erbse.service.TempService;
import org.docking.erbse.service.TempServiceImpl;
import org.docking.erbse.vo.TempVO;

public class TempController 
{
	private TempService ts;
	
	public TempController()
	{
		ts = new TempServiceImpl();
	}
	
	public String tempAdd(TempVO tempVO)	throws IOException
	{	
		return ts.tempAdd(tempVO);
	}
	
	public String tempSearch(String tempId)	throws IOException
	{
		return ts.tempSearch(tempId);
	}
	
	public String getLastestData(String contentId)	throws IOException
	{
		return ts.getLastestData(contentId);
	}
}
