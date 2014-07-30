package org.docking.erbse.test;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.vo.MemberVO;

public class DAOTest
{	
	public static void main(String[] args) 
	{
		GenericService<MemberVO>	service = new GenericServiceImpl<MemberVO>();
		
		MemberVO	memberVO = new MemberVO();
		MemberVO	vo = new MemberVO();
		
		memberVO.setMemberId("testdgdsdIddd");
		memberVO.setMemberName("1111");
		memberVO.setPw("testPw");
		memberVO.setType(1);
		
		vo.setMemberId("testsfdgIddd");
		vo.setMemberName("1111");
		vo.setPw("testPw");
		vo.setType(1);
		
		List<MemberVO>	list = new ArrayList<MemberVO>();
		
		list.add(memberVO);
		list.add(vo);
		
		System.out.println(service.modify("member_modify", list));
	}
}
