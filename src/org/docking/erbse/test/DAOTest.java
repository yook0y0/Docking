package org.docking.erbse.test;

import java.io.Serializable;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberVO;


public class DAOTest<T extends Serializable> 
{	
	public static void addMember(MemberVO memberVO)
	{
		GenericService<MemberVO>	service = new GenericServiceImpl<MemberVO>();
		service.add("member_add", memberVO);
	}
	
	public static void addDocument(DocumentVO documentVO)
	{
		GenericService<DocumentVO>	service = new GenericServiceImpl<DocumentVO>();
		service.add("document_add", documentVO);
	}
	
	public static <T extends Serializable> void main(String[] args) 
	{
		MemberVO	memberVO = new MemberVO();
		
		memberVO.setMemberId("testId");
		memberVO.setMemberName("modify");
		memberVO.setPw("testPw");
		memberVO.setType(1);
		
		addMember(memberVO);
	}
}
