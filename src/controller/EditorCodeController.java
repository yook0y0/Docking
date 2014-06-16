package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.EditorCodeVO;

public class EditorCodeController 
{
private	GenericService<EditorCodeVO>	genericService;
	
	public EditorCodeController()
	{
		genericService = new GenericServiceImpl<EditorCodeVO>();
	}

	public GenericService<EditorCodeVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<EditorCodeVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, EditorCodeVO editorCodeVO)	throws RuntimeException
	{
		genericService.add(mapper, editorCodeVO);
	}
	
	public void modify(String mapper, EditorCodeVO editorCodeVO)	throws RuntimeException
	{
		genericService.modify(mapper, editorCodeVO);
	}
	
	public EditorCodeVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<EditorCodeVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
