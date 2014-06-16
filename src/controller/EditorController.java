package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.EditorVO;

public class EditorController 
{
private	GenericService<EditorVO>	genericService;
	
	public EditorController()
	{
		genericService = new GenericServiceImpl<EditorVO>();
	}

	public GenericService<EditorVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<EditorVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, EditorVO editorCodeVO)	throws RuntimeException
	{
		genericService.add(mapper, editorCodeVO);
	}
	
	public void modify(String mapper, EditorVO editorCodeVO)	throws RuntimeException
	{
		genericService.modify(mapper, editorCodeVO);
	}
	
	public EditorVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<EditorVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
