package controller;

import java.util.List;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.MemberVO;

public class MemberController 
{
	private	GenericService<MemberVO>	genericService;
	
	public MemberController()
	{
		genericService = new GenericServiceImpl<MemberVO>();
	}

	public GenericService<MemberVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<MemberVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, MemberVO memberVO)	throws RuntimeException
	{
		genericService.add(mapper, memberVO);
	}
	
	public void modify(String mapper, MemberVO memberVO)	throws RuntimeException
	{
		genericService.modify(mapper, memberVO);
	}
	
	public MemberVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<MemberVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
}
