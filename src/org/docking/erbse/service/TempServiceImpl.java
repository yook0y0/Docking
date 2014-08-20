package org.docking.erbse.service;

import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.TempVO;

public class TempServiceImpl implements TempService 
{
	@Override
	public String tempAdd(TempVO tempVO) 
	{
		GenericService<TempVO>	tService = new GenericServiceImpl<TempVO>();
		tService.add("temp_add",tempVO);
		
		return getLastestBackUp();
	}

	@Override
	public String tempSearch(String tempId) 
	{
		GenericService<TempVO>	tempService = new GenericServiceImpl<TempVO>();
		TempVO	tempVO = tempService.search("temp_search",Integer.valueOf(tempId));
		
		return tempVO.getContentsBody();
	}
	
	private String getLastestBackUp()
	{
		GenericService<TempVO>	tService = new GenericServiceImpl<TempVO>();
		List<TempVO>	tempList = tService.searchAll("temp_searchAll");
		
		int	lastDate = 0;

		if(tempList.size() != 0)
		{
			lastDate = tempList.get(0).getTempId();
			
			for(TempVO vo : tempList)
			{
				if(vo.getTempId() >= lastDate)
				{
					lastDate = vo.getTempId();
				}
			}
		}
		
		TempVO	vo = tService.search("temp_search", lastDate);
		
		String[] objName = new String[]{"tempVO"};

		String jEvo = JsonParser.getInstance().jParseObj(GlobalVariable.TEMP_VO_FIELD, new String[]{String.valueOf(vo.getTempId()),vo.getContentId(),vo.getMemberId(),vo.getContentsBody(),vo.getBackUpDate()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvo});
	}
}
