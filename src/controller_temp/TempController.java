package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.TempVO;

public class TempController 
{
private	GenericService<TempVO>	genericService;
	
	public TempController()
	{
		genericService = new GenericServiceImpl<TempVO>();
	}

	public GenericService<TempVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<TempVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, TempVO tempVO)	throws RuntimeException
	{
		genericService.add(mapper, tempVO);
	}
	
	public void modify(String mapper, TempVO tempVO)	throws RuntimeException
	{
		genericService.modify(mapper, tempVO);
	}
	
	public TempVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<TempVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
