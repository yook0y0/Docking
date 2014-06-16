package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.DockingEnvironmentVO;

public class DockingEnvironmentController 
{
	private	GenericService<DockingEnvironmentVO>	genericService;
	
	public DockingEnvironmentController()
	{
		genericService = new GenericServiceImpl<DockingEnvironmentVO>();
	}

	public GenericService<DockingEnvironmentVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<DockingEnvironmentVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, DockingEnvironmentVO dockingEnvironmentVO)	throws RuntimeException
	{
		genericService.add(mapper, dockingEnvironmentVO);
	}
	
	public void modify(String mapper, DockingEnvironmentVO dockingEnvironmentVO)	throws RuntimeException
	{
		genericService.modify(mapper, dockingEnvironmentVO);
	}
	
	public DockingEnvironmentVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<DockingEnvironmentVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
