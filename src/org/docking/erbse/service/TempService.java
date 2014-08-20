package org.docking.erbse.service;

import org.docking.erbse.vo.TempVO;

public interface TempService 
{
	abstract public String tempAdd(TempVO tempVO);
	abstract public String tempSearch(String tempId);
	abstract public String getLastestData(String contentId);
}
