package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.ContentsVO;

public class ContentsController 
{
	private	GenericService<ContentsVO>	genericService;
	
	public ContentsController()
	{
		genericService = new GenericServiceImpl<ContentsVO>();
	}

	public GenericService<ContentsVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<ContentsVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, ContentsVO contentsVO)	throws RuntimeException
	{
		genericService.add(mapper, contentsVO);
	}
	
	public void modify(String mapper, ContentsVO contentsVO)	throws RuntimeException
	{
		genericService.modify(mapper, contentsVO);
	}
	
	public ContentsVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<ContentsVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
